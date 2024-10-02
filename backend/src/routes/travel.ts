const router = require('express').Router();
import { getMRT, getBus, calculateMRTFare, calculateBusFare } from "../controllers/travelController";

// @route   GET /api/travel/mrt
// @desc    Get MRT information
// @access  Public
router.get('/mrt', getMRT);

// @route   GET /api/travel/bus
// @desc    Get Bus information
// @access  Public
router.get('/bus', getBus);

// @route   POST /api/travel/mrt/fare
// @desc    Calculate MRT fare
// @access  Public
router.post('/mrt/fare', calculateMRTFare);

// @route   POST /api/travel/bus/fare
// @desc    Calculate Bus fare
// @access  Public
router.post('/bus/fare', calculateBusFare);

module.exports = router;