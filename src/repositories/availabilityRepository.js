const { randomUUID } = require("crypto");

let availabilities = [];

/**
 * Cria uma disponibilidade
 */
function createAvailability({ practitionerId, dayOfWeek, startTime, endTime }) {
  const availability = {
    id: randomUUID(),
    practitionerId,
    dayOfWeek,    // 0-6 (domingo=0)
    startTime,    // "HH:MM"
    endTime,      // "HH:MM"
  };

  availabilities.push(availability);
  return availability;
}

/**
 * Lista TODAS as disponibilidades de um profissional
 */
function listAvailabilitiesByPractitioner(practitionerId) {
  return availabilities.filter((a) => a.practitionerId === practitionerId);
}

/**
 * Alias para manter compatibilidade com código antigo
 */
function listAvailabilities(practitionerId) {
  return listAvailabilitiesByPractitioner(practitionerId);
}

/**
 * Lista disponibilidades de um profissional em um dia específico
 * (usado por serviços de slots, se existir)
 */
function listAvailabilitiesByPractitionerAndDay(practitionerId, dayOfWeek) {
  return availabilities.filter(
    (a) => a.practitionerId === practitionerId && a.dayOfWeek === dayOfWeek
  );
}

/**
 * Remove TODAS as disponibilidades de um profissional
 */
function deleteAvailabilitiesByPractitioner(practitionerId) {
  availabilities = availabilities.filter(
    (a) => a.practitionerId !== practitionerId
  );
}

module.exports = {
  createAvailability,
  listAvailabilitiesByPractitioner,
  listAvailabilities,
  listAvailabilitiesByPractitionerAndDay,
  deleteAvailabilitiesByPractitioner,
};
