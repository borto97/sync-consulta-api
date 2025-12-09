// src/repositories/patientRepository.js
const { v4: uuid } = require("uuid");

// Persistência em memória
const patients = [];

function findAll() {
  return patients;
}

function findById(id) {
  return patients.find((p) => p.id === id) || null;
}

function create(data) {
  const patient = {
    id: uuid(),
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    notes: data.notes || null,
    birthDate: data.birthDate || null,
    sex: data.sex || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  patients.push(patient);
  return patient;
}

function update(id, data) {
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return null;

  patients[index] = {
    ...patients[index],
    ...data,
    updatedAt: new Date(),
  };

  return patients[index];
}

function remove(id) {
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return false;

  patients.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
