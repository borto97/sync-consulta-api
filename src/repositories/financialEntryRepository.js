const { v4: uuid } = require("uuid");

class FinancialEntryRepository {
  constructor() {
    this.entries = [];
  }

  create(data) {
    const entry = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.entries.push(entry);
    return entry;
  }

  findAll(filters = {}) {
    let results = [...this.entries];

    if (filters.startDate) {
      results = results.filter(e => e.date >= filters.startDate);
    }
    if (filters.endDate) {
      results = results.filter(e => e.date <= filters.endDate);
    }
    if (filters.type) {
      results = results.filter(e => e.type === filters.type);
    }
    if (filters.professionalId) {
      results = results.filter(e => e.professionalId === filters.professionalId);
    }
    if (filters.patientId) {
      results = results.filter(e => e.patientId === filters.patientId);
    }
    if (filters.appointmentId) {
      results = results.filter(e => e.appointmentId === filters.appointmentId);
    }

    return results;
  }

  // NOVO — retorna dados crus do mês
  findByMonth(month) {
    const prefix = `${month}-`;
    return this.entries.filter(e => typeof e.date === "string" && e.date.startsWith(prefix));
  }

  findById(id) {
    return this.entries.find(e => e.id === id) || null;
  }

  findByAppointmentId(appointmentId) {
    return this.entries.filter(e => e.appointmentId === appointmentId);
  }

  update(id, updates) {
    const idx = this.entries.findIndex(e => e.id === id);
    if (idx === -1) return null;

    this.entries[idx] = {
      ...this.entries[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.entries[idx];
  }

  delete(id) {
    const idx = this.entries.findIndex(e => e.id === id);
    if (idx === -1) return false;

    this.entries.splice(idx, 1);
    return true;
  }
}

module.exports = new FinancialEntryRepository();
