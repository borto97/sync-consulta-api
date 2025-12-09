const appointmentService = require("./appointmentService");
const financialEntryService = require("./financialEntryService");
const practitionerService = require("./practitionerService");

/**
 * Serviço de dashboards do SyncConsulta.
 * Ainda não implementado — será usado para:
 *  - atendimentos por categoria
 *  - atendimentos por profissional
 *  - timelines (diário, semanal, mensal)
 *  - distribuições financeiras por categoria/profissional
 */
class DashboardService {
  // Exemplos de métodos futuros (apenas rascunho):
  //
  // getAppointmentsByCategory(startDate, endDate) {}
  // getAppointmentsByProfessional(startDate, endDate) {}
  // getAppointmentTimeline(month) {}
  // getFinancialCategoryBreakdown(month) {}
  // getProfessionalProductivity(month) {}
}

module.exports = new DashboardService();
