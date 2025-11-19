const { v4: uuidv4 } = require('uuid');

// Armazenamento em memória
// Cada item:
// {
//   id: string,
//   practitionerId: string,
//   dayOfWeek: string,     // 'monday', 'tuesday', ...
//   startTime: string,     // '09:00'
//   endTime: string,       // '12:00'
//   createdAt: string,
//   updatedAt: string
// }
const availabilities = [];

/**
 * Cria uma disponibilidade para um profissional
 * data: { practitionerId, dayOfWeek, startTime, endTime }
 */
function createAvailability(data) {
  const now = new Date().toISOString();

  const availability = {
    id: uuidv4(),
    practitionerId: data.practitionerId,
    dayOfWeek: data.dayOfWeek,
    startTime: data.startTime,
    endTime: data.endTime,
    createdAt: now,
    updatedAt: now,
  };

  availabilities.push(availability);
  return availability;
}

/**
 * Lista todas as disponibilidades de um profissional
 */
function listAvailabilitiesByPractitioner(practitionerId) {
  return availabilities.filter(
    (item) => item.practitionerId === practitionerId
  );
}

/**
 * Lista todas as disponibilidades (sem filtro)
 */
function list() {
  return availabilities;
}

/**
 * Remove todas as disponibilidades de um profissional
 */
function deleteAvailabilitiesByPractitioner(practitionerId) {
  for (let i = availabilities.length - 1; i >= 0; i--) {
    if (availabilities[i].practitionerId === practitionerId) {
      availabilities.splice(i, 1);
    }
  }
}

module.exports = {
  createAvailability,
  listAvailabilitiesByPractitioner,
  deleteAvailabilitiesByPractitioner,
  list,
};
