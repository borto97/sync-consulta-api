// src/services/specialAvailabilityService.js
const practitionerRepository = require('../repositories/practitionerRepository');
const specialAvailabilityRepository = require('../repositories/specialAvailabilityRepository');

// Tu já tem validações de data/hora nos módulos de disponibilidade semanal.
// Vamos manter as mesmas regras simples e diretas aqui.

function assertExists(value, field) {
  if (!value) {
    const err = new Error(`Campo obrigatório ausente: ${field}`);
    err.statusCode = 400;
    throw err;
  }
}

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidTime(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

/**
 * Cria disponibilidade especial sem substituir a semanal.
 * Apenas adiciona mais janelas.
 */
async function createSpecialAvailability(practitionerId, payload) {
  const practitioner = await practitionerRepository.findById(practitionerId);

  if (!practitioner) {
    const err = new Error('Profissional não encontrado');
    err.statusCode = 404;
    throw err;
  }

  const { date, startTime, endTime } = payload;

  assertExists(date, 'date');
  assertExists(startTime, 'startTime');
  assertExists(endTime, 'endTime');

  if (!isValidDate(date)) {
    const err = new Error('Formato inválido de data (use YYYY-MM-DD)');
    err.statusCode = 400;
    throw err;
  }

  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    const err = new Error('Horário deve estar no formato HH:mm');
    err.statusCode = 400;
    throw err;
  }

  // Aqui não bloqueamos overlap.
  // Overlaps serão tratados depois, caso tu queira.
  return specialAvailabilityRepository.create({
    practitionerId,
    date,
    startTime,
    endTime,
  });
}

/**
 * Retorna TODAS as janelas especiais de uma data.
 */
function getSpecialAvailabilitiesForDate(practitionerId, date) {
  return specialAvailabilityRepository.findByPractitionerAndDate(
    practitionerId,
    date
  );
}

module.exports = {
  createSpecialAvailability,
  getSpecialAvailabilitiesForDate,
};
