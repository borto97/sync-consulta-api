// src/routes/slotRoutes.js

const express = require('express');
const router = express.Router();

const slotController = require('../controllers/slotController');

// GET /api/practitioners/:id/slots?date=YYYY-MM-DD&slot=50
router.get('/practitioners/:id/slots', slotController.getSlotsForPractitioner);

module.exports = router;
