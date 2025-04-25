import express from 'express';
import { validate } from '../middleware/validateRequest';
import { createCategoryRules, updateCategoryRules } from '../validators/categoryValidator';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryController';

const router = express.Router();

router.post('/', validate(createCategoryRules), createCategory);
router.get('/', getAllCategories);
router.put('/:id', validate(updateCategoryRules), updateCategory);
router.delete('/:id', deleteCategory);

export { router };