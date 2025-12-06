const availabilityRepository = require('../repositories/availabilityRepository');
const practitionerRepository = require('../repositories/practitionerRepository');

/**
 * Cria uma disponibilidade para um profissional.
 * data = { practitionerId, dayOfWeek, startTime, endTime }
 */
function createAvailability(data) {
  const practitioner = practitionerRepository.findById(data.practitionerId);

  if (!practitioner) {
    throw new Error('Profissional não encontrado.');
  }

  // TODO futuramente: validar se os horários fazem sentido
  // ex.: startTime < endTime, dia válido, etc.

  return availabilityRepository.createAvailability(data);
}

/**
 * Lista disponibilidades de um profissional
 */
function listAvailabilities(practitionerId) {
  const practitioner = practitionerRepository.findById(practitionerId);

  if (!practitioner) {
    throw new Error('Profissional não encontrado.');
  }

  return availabilityRepository.listAvailabilitiesByPractitioner(practitionerId);
}

module.exports = {
  createAvailability,
  listAvailabilities
};