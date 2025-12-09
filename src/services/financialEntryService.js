// src/services/financialEntryService.js
// Corrigido e organizado — versão final

const repo = require("../repositories/financialEntryRepository");
const appointmentService = require("./appointmentService");
const practitionerService = require("./practitionerService");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class FinancialEntryService {
  create(data) {
    const { date, amount, type, appointmentId } = data;

    if (!date) throw new BadRequestError("Campo 'date' é obrigatório.");
    if (!amount || amount <= 0)
      throw new BadRequestError("Campo 'amount' deve ser maior que zero.");
    if (!type || !["INCOME", "EXPENSE"].includes(type))
      throw new BadRequestError("Campo 'type' deve ser INCOME ou EXPENSE.");

    if (appointmentId) {
      appointmentService.getAppointmentById(appointmentId);
    }

    return repo.create(data);
  }

  findAll(filters) {
    return repo.findAll(filters);
  }

  findById(id) {
    const entry = repo.findById(id);
    if (!entry) throw new NotFoundError("Lançamento financeiro não encontrado.");
    return entry;
  }

  update(id, data) {
    const existing = repo.findById(id);
    if (!existing) throw new NotFoundError("Lançamento financeiro não encontrado.");

    if (data.appointmentId) {
      appointmentService.getAppointmentById(data.appointmentId);
    }

    return repo.update(id, data);
  }

  delete(id) {
    const ok = repo.delete(id);
    if (!ok) throw new NotFoundError("Lançamento financeiro não encontrado.");
    return true;
  }

  getByAppointment(appointmentId) {
    appointmentService.getAppointmentById(appointmentId);
    return repo.findByAppointmentId(appointmentId);
  }

  // ------------------------------------------------------------
  // SUMMARY MENSAL (COM NOME DO PROFISSIONAL)
  // ------------------------------------------------------------
  getMonthlySummary(month) {
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestError("Parâmetro 'month' deve estar no formato YYYY-MM.");
    }

    const entries = repo.findByMonth(month);

    let total_income = 0;
    let total_expense = 0;

    const byCategory = {};
    const totalsByProfessional = {};

    for (const e of entries) {
      if (e.type === "INCOME") total_income += e.amount;
      else if (e.type === "EXPENSE") total_expense += e.amount;

      if (e.category) {
        byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      }

      if (e.professionalId) {
        totalsByProfessional[e.professionalId] =
          (totalsByProfessional[e.professionalId] || 0) + e.amount;
      }
    }

    const byProfessional = {};

    for (const [professionalId, value] of Object.entries(totalsByProfessional)) {
      let professionalName = null;

      try {
        const practitioner = practitionerService.getPractitionerById(professionalId);
        if (practitioner && practitioner.name) {
          professionalName = practitioner.name;
        }
      } catch (err) {
        professionalName = null;
      }

      byProfessional[professionalId] = {
        professionalId,
        professionalName,
        value,
      };
    }

    return {
      month,
      total_income,
      total_expense,
      balance: total_income - total_expense,
      byCategory,
      byProfessional,
    };
  }

  // ------------------------------------------------------------
  // PAYOUTS MENSAL (COM NOME DO PROFISSIONAL)
  // ------------------------------------------------------------
  getMonthlyPayouts(month) {
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestError("Parâmetro 'month' deve estar no formato YYYY-MM.");
    }

    const entries = repo.findByMonth(month);

    let total_income = 0;
    let total_expense = 0;

    const payouts = {};

    for (const e of entries) {
      if (e.type === "INCOME" && e.professionalId) {
        total_income += e.amount;

        if (!payouts[e.professionalId]) {
          payouts[e.professionalId] = {
            professionalId: e.professionalId,
            professionalName: null,
            total_income: 0,
            total_appointments: 0,
            categories: {},
            _appointments: new Set(),
          };
        }

        payouts[e.professionalId].total_income += e.amount;

        if (e.category) {
          payouts[e.professionalId].categories[e.category] =
            (payouts[e.professionalId].categories[e.category] || 0) + e.amount;
        }

        if (e.appointmentId) {
          payouts[e.professionalId]._appointments.add(e.appointmentId);
        }
      }

      if (e.type === "EXPENSE" && e.professionalId) {
        total_expense += e.amount;
      }
    }

    // Completar contagem e adicionar NOME DO PROFISSIONAL
    for (const profId in payouts) {
      const data = payouts[profId];

      data.total_appointments = data._appointments.size;
      delete data._appointments;

      try {
        const practitioner = practitionerService.getPractitionerById(profId);
        data.professionalName = practitioner?.name || null;
      } catch (err) {
        data.professionalName = null;
      }
    }

    return {
      month,
      summary: {
        total_income,
        total_expense,
        balance: total_income - total_expense,
      },
      payouts,
    };
  }

  // ------------------------------------------------------------
  // EXPORT CSV — COMPLETO
  // ------------------------------------------------------------
  exportAllToCSV() {
    const entries = this.findAll({});

    const lines = [];
    lines.push("id,date,amount,type,category,professionalId,appointmentId");

    for (const e of entries) {
      lines.push(
        [
          this._escapeCSV(e.id),
          this._escapeCSV(e.date),
          this._escapeCSV(e.amount),
          this._escapeCSV(e.type),
          this._escapeCSV(e.category),
          this._escapeCSV(e.professionalId),
          this._escapeCSV(e.appointmentId),
        ].join(",")
      );
    }

    return lines.join("\n");
  }

  exportMonthlySummaryToCSV(month) {
    const summary = this.getMonthlySummary(month);

    const lines = [];

    lines.push("month,total_income,total_expense,balance");
    lines.push(
      [
        this._escapeCSV(summary.month),
        this._escapeCSV(summary.total_income),
        this._escapeCSV(summary.total_expense),
        this._escapeCSV(summary.balance),
      ].join(",")
    );

    lines.push("");
    lines.push("category,value");

    for (const [cat, val] of Object.entries(summary.byCategory)) {
      lines.push([this._escapeCSV(cat), this._escapeCSV(val)].join(","));
    }

    lines.push("");
    lines.push("professionalId,professionalName,value");

    for (const [professionalId, data] of Object.entries(summary.byProfessional)) {
      lines.push(
        [
          this._escapeCSV(professionalId),
          this._escapeCSV(data.professionalName),
          this._escapeCSV(data.value),
        ].join(",")
      );
    }

    return lines.join("\n");
  }

  exportMonthlyPayoutsToCSV(month) {
    const result = this.getMonthlyPayouts(month);
    const { summary, payouts } = result;

    const lines = [];

    lines.push("month,total_income,total_expense,balance");
    lines.push(
      [
        this._escapeCSV(result.month),
        this._escapeCSV(summary.total_income),
        this._escapeCSV(summary.total_expense),
        this._escapeCSV(summary.balance),
      ].join(",")
    );

    lines.push("");
    lines.push("professionalId,professionalName,total_income,total_appointments");

    for (const [professionalId, data] of Object.entries(payouts)) {
      lines.push(
        [
          this._escapeCSV(professionalId),
          this._escapeCSV(data.professionalName),
          this._escapeCSV(data.total_income),
          this._escapeCSV(data.total_appointments),
        ].join(",")
      );
    }

    lines.push("");
    lines.push("professionalId,professionalName,category,value");

    for (const [professionalId, data] of Object.entries(payouts)) {
      for (const [category, value] of Object.entries(data.categories)) {
        lines.push(
          [
            this._escapeCSV(professionalId),
            this._escapeCSV(data.professionalName),
            this._escapeCSV(category),
            this._escapeCSV(value),
          ].join(",")
        );
      }
    }

    return lines.join("\n");
  }

  // ------------------------------------------------------------
  // UTIL
  // ------------------------------------------------------------
  _escapeCSV(value) {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  }
}

module.exports = new FinancialEntryService();
