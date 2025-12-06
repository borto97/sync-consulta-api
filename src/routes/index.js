// src/routes/index.js

const express = require("express");
const router = express.Router();

const practitionerRoutes = require("./practitionerRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const availabilityRoutes = require("./availabilityRoutes");
const slotRoutes = require("./slotRoutes");
const blockRoutes = require("./blockRoutes");

// Rotas de profissionais
router.use("/practitioners", practitionerRoutes);

// Rotas de agendamentos
router.use("/appointments", appointmentRoutes);

// Rotas de disponibilidades
router.use("/", availabilityRoutes);

// Rotas de slots
router.use("/", slotRoutes);

router.use("/blocks", blockRoutes);

module.exports = router;
