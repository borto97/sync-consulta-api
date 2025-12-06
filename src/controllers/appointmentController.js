const { dayjs } = require('../utils/time');
const appointmentService = require('../services/appointmentService');

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

// 🔥 Cancelar agendamento
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

async function searchAppointments(req, res) {
  try {
    const filters = req.query;

    const results = appointmentService.searchAppointments(filters);

    const final = results.map(appt => ({
      ...appt,
      startTime: dayjs(appt.startTime).format(),
      endTime: dayjs(appt.endTime).format(),
    }));

    return res.json(final);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function updateAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    const data = req.body;

    const updated = await appointmentService.updateAppointment(appointmentId, data);

    return res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    return res.status(err.statusCode || 500).json({
      error: err.message || "Erro ao atualizar agendamento."
    });
  }
}

// 🔥 NOVO — Buscar agendamento por ID
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
    return res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByPractitioner,
  listOccupied,
  cancelAppointment,
  searchAppointments,
  updateAppointment,
  getAppointmentById, // ← NOVO
};
