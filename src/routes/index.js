const express = require("express");
const router = express.Router();

const practitionerRoutes = require("./practitionerRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const availabilityRoutes = require("./availabilityRoutes");
const slotRoutes = require("./slotRoutes");
const blockRoutes = require("./blockRoutes");
const patientRoutes = require("./patientRoutes");
const recordRoutes = require("./recordRoutes");
const financialEntryRoutes = require("./financialEntryRoutes");
const financialEntryController = require("../controllers/financialEntryController");

// Rotas de profissionais
router.use("/practitioners", practitionerRoutes);

// Rotas de agendamentos
router.use("/appointments", appointmentRoutes);

// Rotas de disponibilidades
router.use("/", availabilityRoutes);

// Rotas de slots
router.use("/", slotRoutes);

router.use("/blocks", blockRoutes);

router.use("/patients", patientRoutes);

router.use("/records", recordRoutes);

// Rotas de lançamentos financeiros (CRUD + summary + exports)
router.use("/financial-entries", financialEntryRoutes);

// Repasses por profissional (JSON)
router.get(
  "/financial/payouts",
  financialEntryController.getMonthlyPayouts.bind(financialEntryController)
);

// Repasses por profissional (CSV)
router.get(
  "/financial/payouts/export",
  financialEntryController.exportMonthlyPayouts.bind(financialEntryController)
);

module.exports = router;
