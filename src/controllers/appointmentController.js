// -------------------------------------------------------
// src/controllers/appointmentController.js
// -------------------------------------------------------
// Controlador responsável pelo fluxo de agendamentos:
// criação, listagem, busca avançada, cancelamento,
// atualização, consulta por ID e integração financeira.
// -------------------------------------------------------

const { dayjs } = require('../utils/time');
const appointmentService = require('../services/appointmentService');
const financialEntryService = require('../services/financialEntryService');

// -------------------------------------------------------
// A) Criar agendamento
// -------------------------------------------------------
async function createAppointment(req, res) {
  try {
    const data = req.body;

    const appointment = await appointmentService.createAppointment(data);

    const formatted = {
      ...appointment,
      startTime: dayjs(appointment.startTime).format(),
      endTime: dayjs(appointment.endTime).format(),
    };

    return res.status(201).json(formatted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------
// B) Listar todos os agendamentos
// -------------------------------------------------------
async function listAppointments(req, res) {
  try {
    const appointments = appointmentService.listAppointments();

    const formatted = appointments.map((appt) => ({
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao listar agendamentos' });
  }
}

// -------------------------------------------------------
// C) Listar agendamentos por profissional
// -------------------------------------------------------
async function listAppointmentsByPractitioner(req, res) {
  try {
    const { practitionerId } = req.params;
    const appointments = appointmentService.listAppointmentsByPractitioner(practitionerId);

    const formatted = appointments.map((appt) => ({
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------
// D) Listar horários ocupados no dia
// -------------------------------------------------------
async function listOccupied(req, res) {
  try {
    const { practitionerId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Query param 'date' é obrigatório. Use YYYY-MM-DD" });
    }

    const occupied = appointmentService.getOccupiedByDay(practitionerId, date);

    const formatted = occupied.map((appt) => ({
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------
// E) Cancelar agendamento
// -------------------------------------------------------
async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;

    const cancelled = appointmentService.cancelAppointment(id);

    const formatted = {
      ...cancelled,
      startTime: dayjs(cancelled.startTime).format(),
      endTime: dayjs(cancelled.endTime).format(),
    };

    return res.json(formatted);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------
// F) Busca avançada
// -------------------------------------------------------
async function searchAppointments(req, res) {
  try {
    const filters = req.query;

    const results = appointmentService.searchAppointments(filters);

    const final = results.map((appt) => ({
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    }));

    return res.json(final);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------
// G) Atualizar agendamento
// -------------------------------------------------------
async function updateAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    const data = req.body;

    const updated = await appointmentService.updateAppointment(appointmentId, data);

    return res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    return res.status(err.statusCode || 500).json({
      error: err.message || "Erro ao atualizar agendamento.",
    });
  }
}

// -------------------------------------------------------
// H) Buscar agendamento por ID
// -------------------------------------------------------
async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;

    const appt = await appointmentService.getAppointmentById(id);

    const formatted = {
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    };

    return res.json(formatted);
  } catch (err) {
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

// -------------------------------------------------------
// I) Listar lançamentos financeiros vinculados ao appointment
// -------------------------------------------------------
// Este endpoint precisa repassar corretamente os erros do service
// (ex.: appointment não existe → 404, não 500)
async function getFinancialEntries(req, res) {
  try {
    const appointmentId = req.params.id;

    const entries = financialEntryService.getByAppointment(appointmentId);

    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

// -------------------------------------------------------
// Exportação
// -------------------------------------------------------
module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByPractitioner,
  listOccupied,
  cancelAppointment,
  searchAppointments,
  updateAppointment,
  getAppointmentById,
  getFinancialEntries,
};