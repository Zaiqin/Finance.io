const router = require('express').Router();
import { getMRT, getBus } from "../controllers/travelController";

// @route   GET /api/travel/mrt
// @desc    Get MRT information
// @access  Public
router.get('/mrt', getMRT);

// @route   GET /api/travel/bus
// @desc    Get Bus information
// @access  Public
router.get('/bus', getBus);

module.exports = router;