const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availabilityController");

// ROTAS ANTIGAS (por profissional) – mantidas para compatibilidade
router.post(
  "/practitioners/:practitionerId/availabilities",
  availabilityController.createAvailability
);

router.get(
  "/practitioners/:practitionerId/availabilities",
  availabilityController.listAvailabilities
);

// NOVO — listar via query: GET /api/availabilities?practitionerId=...
router.get(
  "/availabilities",
  availabilityController.listAvailabilitiesByQuery
);

// NOVO — salvar tudo em massa: POST /api/availabilities/bulk
router.post(
  "/availabilities/bulk",
  availabilityController.saveBulkAvailabilities
);

module.exports = router;
