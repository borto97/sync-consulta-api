// src/repositories/appointmentRepository.js
// --------------------------------------------------------
// Repositório de Agendamentos (Singleton Real)
// --------------------------------------------------------
// Esta implementação garante que TODO o sistema utilize
// a mesma instância de appointments — eliminando o bug
// onde financialEntryService não encontrava agendamentos
// criados via controller.
//
// A versão anterior usava variáveis soltas no módulo,
// suscetíveis a ciclos de carregamento e múltiplas instâncias
// em ambientes Windows, causando inconsistência.
// --------------------------------------------------------

const { v4: uuidv4 } = require("uuid");

class AppointmentRepository {
  constructor() {
    // Lista única de agendamentos
    this.appointments = [];
  }

  // ------------------------------------------------------
  // Criar novo agendamento
  // ------------------------------------------------------
  createAppointment(data) {
    const now = new Date().toISOString();

    const appointment = {
      id: uuidv4(),
      notes: null,
      status: "SCHEDULED",
      ...data,
      createdAt: now,
    };

    this.appointments.push(appointment);
    return appointment;
  }

  // ------------------------------------------------------
  // Listar todos os agendamentos
  // ------------------------------------------------------
  list() {
    return this.appointments;
  }

  // ------------------------------------------------------
  // Listar agendamentos por profissional
  // ------------------------------------------------------
  listAppointmentsByPractitioner(practitionerId) {
    return this.appointments.filter(
      (appt) => appt.practitionerId === practitionerId
    );
  }

  // ------------------------------------------------------
  // Buscar por ID
  // ------------------------------------------------------
  findById(id) {
    return this.appointments.find((appt) => appt.id === id) || null;
  }

  // ------------------------------------------------------
  // Atualizar agendamento existente
  // ------------------------------------------------------
  update(appointment) {
    const index = this.appointments.findIndex((a) => a.id === appointment.id);
    if (index === -1) return null;

    const updated = {
      ...this.appointments[index],
      ...appointment,
      updatedAt: new Date().toISOString(),
    };

    this.appointments[index] = updated;
    return updated;
  }

  // ------------------------------------------------------
  // Busca avançada por filtros
  // ------------------------------------------------------
  search(filters) {
    let results = this.appointments;

    const { patientName, practitionerIds } = filters;

    // ------------------------------
    // 1) Filtro por nome do paciente
    // ------------------------------
    if (patientName) {
      results = results.filter((appt) =>
        appt.patientName &&
        appt.patientName.toLowerCase().includes(patientName)
      );
    }

    // -------------------------------------------
    // 2) Filtro por lista de IDs de profissionais
    // -------------------------------------------
    if (Array.isArray(practitionerIds) && practitionerIds.length > 0) {
      results = results.filter((appt) =>
        practitionerIds.includes(appt.practitionerId)
      );
    }

    return results;
  }
}

// --------------------------------------------------------
// EXPORTAÇÃO SINGLETON
// --------------------------------------------------------
// Exportando UMA única instância do repositório.
// Essa é a versão correta para impedir duplicações.
// --------------------------------------------------------
module.exports = new AppointmentRepository();
