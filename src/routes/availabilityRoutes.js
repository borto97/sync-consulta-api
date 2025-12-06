// src/routes/availabilityRoutes.js

const express = require("express");
const router = express.Router();

const availabilityController = require("../controllers/availabilityController");

// Criar disponibilidade
// POST /api/practitioners/:id/availabilities
router.post(
  "/practitioners/:id/availabilities",
  availabilityController.createAvailability
);

// Listar disponibilidades
// GET /api/practitioners/:id/availabilities
router.get(
  "/practitioners/:id/availabilities",
  availabilityController.listAvailabilities
);

module.exports = router;
