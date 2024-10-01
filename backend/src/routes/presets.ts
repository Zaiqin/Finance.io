const router = require('express').Router();
import { getAllPresets, addPreset, updatePreset, deletePreset } from '../controllers/presetsController';

// @route   GET /api/presets
// @desc    Get all presets
// @access  Public
router.get('/', getAllPresets);

// @route   POST /api/presets
// @desc    Add a new preset record
// @access  Public
router.post('/', addPreset);

// @route   PUT /api/presets/:id
// @desc    Update a preset record
// @access  Public
router.put('/:id', updatePreset);

// @route   DELETE /api/presets/:id
// @desc    Delete a preset record
// @access  Public
router.delete('/:id', deletePreset);

module.exports = router;