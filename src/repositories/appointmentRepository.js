// src/repositories/appointmentRepository.js
const { v4: uuidv4 } = require('uuid');

let appointments = [];

// Criar agendamento
function createAppointment(data) {
  const now = new Date().toISOString();

  const appointment = {
    id: uuidv4(),
    notes: null,
    status: 'SCHEDULED',
    ...data,
    createdAt: now,
  };

  appointments.push(appointment);
  return appointment;
}

// Listar todos
function list() {
  return appointments;
}

// Listar por profissional
function listAppointmentsByPractitioner(practitionerId) {
  return appointments.filter(
    (appt) => appt.practitionerId === practitionerId
  );
}

// Buscar por ID
function findById(id) {
  return appointments.find((appt) => appt.id === id) || null;
}

// Atualizar (merge)
function update(appointment) {
  const index = appointments.findIndex((a) => a.id === appointment.id);
  if (index === -1) return null;

  const updated = {
    ...appointments[index],
    ...appointment,
    updatedAt: new Date().toISOString(),
  };

  appointments[index] = updated;
  return updated;
}

module.exports = {
  createAppointment,
  list,
  listAppointmentsByPractitioner,
  findById,
  update,
};
