import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    parent_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default: null
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
}, { timestamps: true });

categorySchema.index({ parent_id: 1 }); // Optimize parent-child lookups

const Category = mongoose.model('categories', categorySchema);

export default Category;