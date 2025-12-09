const recordRepository = require("../repositories/recordRepository");
const appointmentRepository = require("../repositories/appointmentRepository");
const patientRepository = require("../repositories/patientRepository");

function createForAppointment(appointmentId, data) {
  const appointment = appointmentRepository.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  if (!appointment.patientId)
    throw new Error("Appointment has no patientId (required for clinical records)");

  const patient = patientRepository.findById(appointment.patientId);
  if (!patient) throw new Error("Patient not found for this appointment");

  if (!data.text || data.text.trim().length === 0)
    throw new Error("Field 'text' is required");

  return recordRepository.create({
    appointmentId,
    patientId: appointment.patientId,
    professionalId: appointment.practitionerId,
    text: data.text,
    plan: data.plan || null,
    notes: data.notes || null,
    tags: data.tags || [],
  });
}

function listByAppointment(appointmentId) {
  const appointment = appointmentRepository.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  return recordRepository.findByAppointmentId(appointmentId);
}

function listByPatient(patientId) {
  const patient = patientRepository.findById(patientId);
  if (!patient) throw new Error("Patient not found");

  return recordRepository.findByPatientId(patientId);
}

function updateRecord(recordId, updates) {
  const existing = recordRepository.findById(recordId);
  if (!existing) throw new Error("Record not found");

  return recordRepository.update(recordId, updates);
}

function deleteRecord(recordId) {
  const ok = recordRepository.remove(recordId);
  if (!ok) throw new Error("Record not found");

  return true;
}

module.exports = {
  createForAppointment,
  listByAppointment,
  listByPatient,
  updateRecord,
  deleteRecord,
};
