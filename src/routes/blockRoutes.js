// src/routes/blockRoutes.js

const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");

// Criar bloqueio
router.post(
  "/practitioners/:id/blocks",
  blockController.createBlock
);

// Listar bloqueios
router.get(
  "/practitioners/:id/blocks",
  blockController.getBlocks   // ✔ CORRIGIDO
);

module.exports = router;