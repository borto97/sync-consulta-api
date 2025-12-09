const service = require("../services/financialEntryService");

class FinancialEntryController {
  create(req, res, next) {
    try {
      const entry = service.create(req.body);
      return res.status(201).json(entry);
    } catch (err) {
      next(err);
    }
  }

  findAll(req, res, next) {
    try {
      const filters = req.query;
      const entries = service.findAll(filters);
      return res.json(entries);
    } catch (err) {
      next(err);
    }
  }

  findById(req, res, next) {
    try {
      const entry = service.findById(req.params.id);
      return res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  update(req, res, next) {
    try {
      const entry = service.update(req.params.id, req.body);
      return res.json(entry);
    } catch (err) {
      next(err);
    }
  }

  delete(req, res, next) {
    try {
      service.delete(req.params.id);
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  getMonthlySummary(req, res, next) {
    try {
      const { month } = req.query;
      const summary = service.getMonthlySummary(month);
      return res.json(summary);
    } catch (err) {
      next(err);
    }
  }

  // Repasses por profissional (JSON)
  getMonthlyPayouts(req, res, next) {
    try {
      const { month } = req.query;
      const result = service.getMonthlyPayouts(month);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // NOVO — export CSV de todos os lançamentos
  exportAll(req, res, next) {
    try {
      const csv = service.exportAllToCSV();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="financial_entries.csv"'
      );
      return res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  // NOVO — export CSV do summary mensal
  exportMonthlySummary(req, res, next) {
    try {
      const { month } = req.query;
      const csv = service.exportMonthlySummaryToCSV(month);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="financial_entries_summary_${month || "invalid"}.csv"`
      );
      return res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  // NOVO — export CSV de payouts mensais
  exportMonthlyPayouts(req, res, next) {
    try {
      const { month } = req.query;
      const csv = service.exportMonthlyPayoutsToCSV(month);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="financial_payouts_${month || "invalid"}.csv"`
      );
      return res.send(csv);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FinancialEntryController();
