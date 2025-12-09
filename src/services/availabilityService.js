// src/services/availabilityService.js
const availabilityRepository = require('../repositories/availabilityRepository');
const practitionerRepository = require('../repositories/practitionerRepository');

/**
 * Cria uma disponibilidade para um profissional.
 * practitionerId: string
 * data = { dayOfWeek, startTime, endTime }
 */
function createAvailability(practitionerId, data) {
  const practitioner = practitionerRepository.findById(practitionerId);

  if (!practitioner) {
    throw new Error('Profissional não encontrado.');
  }

  const { dayOfWeek, startTime, endTime } = data;

  if (!dayOfWeek) {
    throw new Error('dayOfWeek é obrigatório.');
  }

  if (!startTime || !endTime) {
    throw new Error('Horário inválido: startTime e endTime são obrigatórios.');
  }

  return availabilityRepository.createAvailability({
    practitionerId,
    dayOfWeek,
    startTime,
    endTime,
  });
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
  listAvailabilities,
};
