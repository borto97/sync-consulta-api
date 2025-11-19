// src/routes/slotRoutes.js

const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slotController");

// GET /practitioners/:id/slots?date=YYYY-MM-DD
router.get("/:id/slots", slotController.getSlots);

module.exports = router;
