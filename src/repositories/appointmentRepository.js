const { v4: uuidv4 } = require('uuid');

// "Banco de dados" em memória por enquanto
const appointments = [];

/**
 * data: {
 *   practitionerId,
 *   patientName,
 *   patientPhone,
 *   startTime, // string ISO, ex: "2025-11-20T09:00:00"
 *   endTime,   // opcional por enquanto
 *   notes
 * }
 */
function createAppointment(data) {
  const appointment = {
    id: uuidv4(),
    practitionerId: data.practitionerId,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    startTime: data.startTime,
    endTime: data.endTime || null,
    notes: data.notes || null,
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  return appointment;
}

/**
 * Lista todos os agendamentos
 */
function list() {
  return appointments;
}

/**
 * Lista agendamentos por profissional
 */
function listAppointmentsByPractitioner(practitionerId) {
  return appointments.filter((a) => a.practitionerId === practitionerId);
}

module.exports = {
  createAppointment,
  list,
  listAppointmentsByPractitioner,

  // exporto o array bruto só pra debug se precisar
  _appointments: appointments,
};
