const router = require('express').Router();
import { getAllFinances, getFinances, addFinance, updateFinance, deleteFinance } from '../controllers/financesController';

// @route   GET /api/finances
// @desc    Get all finances
// @access  Public
router.get('/', getAllFinances);

// @route   GET /api/finances/:month
// @desc    Get finances by month
// @access  Public
router.get('/:month', getFinances);

// @route   POST /api/finances
// @desc    Add a new finance record
// @access  Public
router.post('/', addFinance);

// @route   PUT /api/finances/:id
// @desc    Update a finance record
// @access  Public
router.put('/:id', updateFinance);

// @route   DELETE /api/finances/:id
// @desc    Delete a finance record
// @access  Public
router.delete('/:id', deleteFinance);

module.exports = router;