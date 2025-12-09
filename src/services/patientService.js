// src/services/patientService.js
const patientRepository = require("../repositories/patientRepository");

function getAllPatients(name) {
  const all = patientRepository.findAll();

  if (!name) return all;

  const q = name.toLowerCase();
  return all.filter((p) => p.name.toLowerCase().includes(q));
}

function getPatientById(id) {
  const patient = patientRepository.findById(id);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
}

function createPatient(data) {
  if (!data.name) throw new Error("Name is required");
  if (!data.email) throw new Error("Email is required");

  const patientToCreate = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    notes: data.notes || null,
    birthDate: data.birthDate || null,
    sex: data.sex || null,
  };

  return patientRepository.create(patientToCreate);
}

function updatePatient(id, data) {
  const existing = patientRepository.findById(id);
  if (!existing) {
    throw new Error("Patient not found");
  }

  const updated = {
    name: data.name ?? existing.name,
    email: data.email ?? existing.email,
    phone: data.phone ?? existing.phone,
    notes: data.notes ?? existing.notes,
    birthDate: data.birthDate ?? existing.birthDate,
    sex: data.sex ?? existing.sex,
  };

  return patientRepository.update(id, updated);
}

function deletePatient(id) {
  const ok = patientRepository.remove(id);
  if (!ok) {
    throw new Error("Patient not found");
  }
  return true;
}

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
