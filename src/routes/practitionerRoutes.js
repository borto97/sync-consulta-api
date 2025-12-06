// src/routes/practitionerRoutes.js
const express = require("express");
const practitionerController = require("../controllers/practitionerController");
const specialAvailabilityController = require("../controllers/specialAvailabilityController");
const router = express.Router();
const blockController = require('../controllers/blockController');

// listar todos
router.get("/", practitionerController.getAll);

// criar um novo profissional
router.post("/", practitionerController.create);

// pegar um profissional pelo ID
router.get("/:id", practitionerController.getById);

// atualizar profissional
router.put("/:id", practitionerController.update);

// remover profissional
router.delete("/:id", practitionerController.remove);

router.post(
  "/:id/special-availabilities",
  specialAvailabilityController.createSpecialAvailability
);

// BLOQUEIOS DE AGENDA
router.post('/:id/blocks', blockController.createBlock);
router.get('/:id/blocks', blockController.getBlocks);

module.exports = router;
