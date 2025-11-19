// src/routes/index.js
const express = require("express");
const router = express.Router();

const practitionerRoutes = require("./practitionerRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const availabilityRoutes = require("./availabilityRoutes");
const slotRoutes = require("./slotRoutes");

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "SyncConsulta API" });
});

// rotas de profissionais
router.use("/practitioners", practitionerRoutes);

// rotas de agendamentos
router.use("/appointments", appointmentRoutes);

// rotas de disponibilidades
router.use("/practitioners", availabilityRoutes);

// rotas de slots
router.use("/practitioners", slotRoutes);

module.exports = router;
