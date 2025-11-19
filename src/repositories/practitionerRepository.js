// src/repositories/practitionerRepository.js
const { v4: uuid } = require("uuid");

// "banco" temporário em memória
const practitioners = [];

function findAll() {
  return practitioners;
}

function findById(id) {
  return practitioners.find((p) => p.id === id) || null;
}

function create(data) {
  const practitioner = {
    id: uuid(),
    name: data.name,
    specialty: data.specialty,
    email: data.email,
    phone: data.phone || null,
    googleCalendarId: data.googleCalendarId || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  practitioners.push(practitioner);
  return practitioner;
}

function update(id, data) {
  const index = practitioners.findIndex((p) => p.id === id);
  if (index === -1) return null;

  practitioners[index] = {
    ...practitioners[index],
    ...data,
    updatedAt: new Date(),
  };

  return practitioners[index];
}

function remove(id) {
  const index = practitioners.findIndex((p) => p.id === id);
  if (index === -1) return false;

  practitioners.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
