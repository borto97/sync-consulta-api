const express = require("express");
const controller = require("../controllers/financialEntryController");

const router = express.Router();

router.post("/", controller.create.bind(controller));
router.get("/", controller.findAll.bind(controller));

router.get("/summary", controller.getMonthlySummary.bind(controller));

// NOVO — export CSV do summary mensal
router.get(
  "/summary/export",
  controller.exportMonthlySummary.bind(controller)
);

// NOVO — export CSV de todos os lançamentos
router.get(
  "/export",
  controller.exportAll.bind(controller)
);

router.get("/:id", controller.findById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;
