// src/services/practitionerService.js
const practitionerRepository = require('../repositories/practitionerRepository');
const { normalizeTimezone, DEFAULT_TIMEZONE } = require('../utils/time');

function getAllPractitioners(name) {
  const all = practitionerRepository.findAll();

  if (!name) return all;

  const q = name.toLowerCase();
  return all.filter((p) => p.name.toLowerCase().includes(q));
}

function getPractitionerById(id) {
  const practitioner = practitionerRepository.findById(id);
  if (!practitioner) {
    throw new Error("Practitioner not found");
  }
  return practitioner;
}

function createPractitioner(data) {
  // Validação mínima
  if (!data.name) throw new Error("Name is required");
  if (!data.specialty) throw new Error("Specialty is required");
  if (!data.email) throw new Error("Email is required");

  // Normaliza timezone (usa default se não enviado)
  const timezone = normalizeTimezone(data.timezone);

  const practitionerToCreate = {
    name: data.name,
    specialty: data.specialty,
    email: data.email,
    phone: data.phone || null,
    googleCalendarId: data.googleCalendarId || null,
    defaultSessionDuration: data.defaultSessionDuration || 50,
    timezone, // <<< ADICIONADO
  };

  return practitionerRepository.create(practitionerToCreate);
}

function updatePractitioner(id, data) {
  const existing = practitionerRepository.findById(id);
  if (!existing) {
    throw new Error("Practitioner not found");
  }

  // timezone existente, caso não venha novo
  let timezone = existing.timezone || DEFAULT_TIMEZONE;

  // Se o cliente quiser atualizar timezone
  if (Object.prototype.hasOwnProperty.call(data, "timezone")) {
    timezone = normalizeTimezone(data.timezone);
  }

  const updated = {
    ...existing,
    name: data.name ?? existing.name,
    specialty: data.specialty ?? existing.specialty,
    email: data.email ?? existing.email,
    phone: data.phone ?? existing.phone,
    googleCalendarId: data.googleCalendarId ?? existing.googleCalendarId,
    defaultSessionDuration:
      data.defaultSessionDuration ?? existing.defaultSessionDuration,
    timezone, // <<< SEMPRE CONSOLIDADO AQUI
  };

  return practitionerRepository.update(id, updated);
}

function deletePractitioner(id) {
  const ok = practitionerRepository.remove(id);
  if (!ok) {
    throw new Error("Practitioner not found");
  }
  return true;
}

module.exports = {
  getAllPractitioners,
  getPractitionerById,
  createPractitioner,
  updatePractitioner,
  deletePractitioner,
};
