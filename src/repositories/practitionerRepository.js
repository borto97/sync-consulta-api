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
  const safeDuration =
    typeof data.defaultSessionDuration === "number" && data.defaultSessionDuration > 0
      ? data.defaultSessionDuration
      : 50; // padrão: 50 minutos

  const practitioner = {
    id: uuid(),
    name: data.name,
    specialty: data.specialty,
    email: data.email,
    phone: data.phone || null,
    googleCalendarId: data.googleCalendarId || null,
    defaultSessionDuration: safeDuration,
    timezone: data.timezone || "America/Sao_Paulo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  practitioners.push(practitioner);
  return practitioner;
}

function update(id, data) {
  const index = practitioners.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = practitioners[index];

  // duration segura
  const safeDuration =
    typeof data.defaultSessionDuration === "number" && data.defaultSessionDuration > 0
      ? data.defaultSessionDuration
      : existing.defaultSessionDuration;

  // atualização campo a campo sem sobrescrever com undefined
  practitioners[index] = {
    ...existing,
    name: data.name ?? existing.name,
    specialty: data.specialty ?? existing.specialty,
    email: data.email ?? existing.email,
    phone: data.phone ?? existing.phone,
    googleCalendarId: data.googleCalendarId ?? existing.googleCalendarId,
    defaultSessionDuration: safeDuration,
    timezone: data.timezone ?? existing.timezone,
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
