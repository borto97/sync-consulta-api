const appointmentService = require('../services/appointmentService');

async function createAppointment(req, res) {
  try {
    const data = req.body;
    const appointment = appointmentService.createAppointment(data);
    return res.status(201).json(appointment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function listAppointments(req, res) {
  try {
    const appointments = appointmentService.listAppointments();
    return res.json(appointments);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao listar agendamentos' });
  }
}

async function listAppointmentsByPractitioner(req, res) {
  try {
    const { practitionerId } = req.params;
    const appointments = appointmentService.listAppointmentsByPractitioner(practitionerId);
    return res.json(appointments);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByPractitioner,
};
