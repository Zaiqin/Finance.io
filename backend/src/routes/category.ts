import { Router } from 'express';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categoryController';

const router = Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getAllCategories);

// @route   POST /api/categories
// @desc    Add a new category record
// @access  Public
router.post('/', addCategory);

// @route   PUT /api/categories/:id
// @desc    Update a category record
// @access  Public
router.put('/:id', updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete a category record
// @access  Public
router.delete('/:id', deleteCategory);

module.exports = router;