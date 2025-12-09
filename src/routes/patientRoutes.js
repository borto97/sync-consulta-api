// src/routes/patientRoutes.js
const express = require("express");
const controller = require("../controllers/patientController");
const recordController = require("../controllers/recordController");

const router = express.Router();

// agora suporta ?name= para busca
router.get("/", controller.getAll);

router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/:id/records", recordController.listByPatient);

module.exports = router;
