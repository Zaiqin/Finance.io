const router = require('express').Router();
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tagController';

// @route   GET /api/tags
// @desc    Get all tags
// @access  Public
router.get('/', getTags);

// @route   POST /api/tags
// @desc    Create a new tag
// @access  Public
router.post('/', createTag);

// @route   PUT /api/tags/:id
// @desc    Update a tag
// @access  Public
router.put('/:id', updateTag);

// @route   DELETE /api/tags/:id
// @desc    Delete a tag
// @access  Public
router.delete('/:id', deleteTag);

module.exports = router;