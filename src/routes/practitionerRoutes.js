// src/routes/practitionerRoutes.js
const express = require("express");
const practitionerController = require("../controllers/practitionerController");

const router = express.Router();

// listar todos
router.get("/", practitionerController.list);

// criar um novo profissional
router.post("/", practitionerController.create);

// pegar um profissional pelo ID
router.get("/:id", practitionerController.getById);

// atualizar profissional
router.put("/:id", practitionerController.update);

// remover profissional
router.delete("/:id", practitionerController.remove);

module.exports = router;
