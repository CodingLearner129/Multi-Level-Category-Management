import { Request, Response } from 'express';
import Category from '../models/Category';
import config from '../config/config';
import { Types } from 'mongoose';

type reqUser = {
    _id: Types.ObjectId,
    email: String,
    password: String,
}

interface UserRequest extends Request {
    user?: reqUser;
}

/**
 * Create a new category
 */
export const createCategory = async (req: UserRequest, res: Response): Promise<any> => {
    try {
        const { name, parent_id }: { name: string, parent_id: string } = req.body;
        const getCategory = await Category.findOne({ name, user_id: req.user!._id });
        if (getCategory) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: "Name already exist. please use different name."
            });
        }

        const newCategory = await Category.create({ name, parent_id: parent_id ? new Types.ObjectId(parent_id) : null, user_id: req.user!._id });

        res.status(config.http_status_ok).json({
            status: config.status_success,
            message: 'Category created successfully',
            data: { category: newCategory }
        });
    } catch (error) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};

/**
 * Get all categories as a tree
 */
export const getAllCategories = async (req: UserRequest, res: Response): Promise<any> => {
    try {
        const categories = await Category.aggregate([
            { $match: { parent_id: null, user_id: req.user!._id } },
            {
                $graphLookup: {
                    from: 'categories',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent_id',
                    as: 'subCategories',
                }
            }
        ]);
        if (categories && categories?.length > 0) {
            res.status(config.http_status_ok).json({
                status: config.status_success,
                message: 'Categories found successfully',
                data: { categories }
            });
        } else {
            res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: "No category found."
            });
        }
    } catch (err) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};

/**
 * Fetch all descendant category IDs using batched BFS
 */
const getAllDescendantIds = async (rootId: Types.ObjectId): Promise<Types.ObjectId[]> => {
    const descendantIds: Types.ObjectId[] = [];
    let queue: Types.ObjectId[] = [rootId];

    while (queue.length > 0) {
        // Fetch all children for the current batch of parent IDs
        const children = await Category.find(
            { parent_id: { $in: queue } },
            '_id'
        );

        const childIds = children.map(child => child._id);
        descendantIds.push(...childIds);
        queue = childIds; // process next level in next loop
    }

    return descendantIds;
};

/**
 * Update category name or status
 */
export const updateCategory = async (req: UserRequest, res: Response): Promise<any> => {
    try {
        const { name, status }: { name: string, status: string } = req.body;
        const categoryId: Types.ObjectId = new Types.ObjectId(req.params.id);

        const category = await Category.findOne({ _id: categoryId, user_id: req.user!._id });
        if (!category) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: "No category found."
            });
        }
        if (name) {
            const checkCategoryName = await Category.findOne({ _id: { $ne: categoryId }, name, user_id: req.user!._id });
            if (checkCategoryName) {
                return res.status(config.http_status_ok).json({
                    status: config.status_fail,
                    message: "Name already exist. please use different name."
                });
            }
        }
        if (category.parent_id && status == "active") {
            const getParentCategory = await Category.findOne({ _id: category.parent_id, user_id: req.user!._id });
            if (getParentCategory && getParentCategory.status !== status) {
                return res.status(config.http_status_ok).json({
                    status: config.status_fail,
                    message: "This category can't be activated while its parent category is inactive."
                });
            }
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id: categoryId, user_id: req.user!._id }, { name: name || category.name, status: status || category.status }, { new: true });
        const descendantIds = await getAllDescendantIds(category._id);
        if (status !== category.status && descendantIds.length > 0) {
            await Category.updateMany({ _id: { $in: descendantIds } }, { $set: { status: status } });
            return res.status(config.http_status_ok).json({
                status: config.status_success,
                message: 'Category updated successfully and children status changed successfully',
                data: { category: updatedCategory }
            });
        }
        res.status(config.http_status_ok).json({
            status: config.status_success,
            message: 'Category updated successfully',
            data: { category: updatedCategory }
        });
    } catch (err) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};

/**
 * Delete a category and reassign children to the deleted category's parent
 */
export const deleteCategory = async (req: UserRequest, res: Response): Promise<any> => {
    try {
        const categoryId: Types.ObjectId = new Types.ObjectId(req.params.id);
        const category = await Category.findOne({ _id: categoryId, user_id: req.user!._id });

        if (!category) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: "No category found."
            });
        }

        await Category.findOneAndDelete({ _id: categoryId, user_id: req.user!._id });
        await Category.updateMany(
            { parent_id: category._id, user_id: req.user!._id },
            { $set: { parent_id: category.parent_id || null } }
        );

        res.status(config.http_status_ok).json({
            status: config.status_success,
            message: 'Category deleted and children reassigned',
        });
    } catch (err) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};
