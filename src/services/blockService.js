// src/services/blockService.js
const practitionerRepository = require('../repositories/practitionerRepository');
const blockRepository = require('../repositories/blockRepository');

// ===== Helpers internos =====

function assert(value, field) {
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

function toMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// ===== SERVICE =====

async function createBlock(practitionerId, payload) {
  assert(practitionerId, 'practitionerId');

  const practitioner = practitionerRepository.findById(practitionerId);
  if (!practitioner) {
    const err = new Error('Profissional não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const { date, startTime, endTime } = payload;

  assert(date, 'date');
  assert(startTime, 'startTime');
  assert(endTime, 'endTime');

  if (!isValidDate(date)) {
    const err = new Error('Formato inválido de data. Use YYYY-MM-DD.');
    err.statusCode = 400;
    throw err;
  }

  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    const err = new Error('Horários devem estar no formato HH:mm.');
    err.statusCode = 400;
    throw err;
  }

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (end <= start) {
    const err = new Error('endTime deve ser maior que startTime.');
    err.statusCode = 400;
    throw err;
  }

  // Criar bloqueio
  return blockRepository.create({
    practitionerId,
    date,
    startTime,
    endTime,
  });
}

function getBlocksForDate(practitionerId, date) {
  return blockRepository.findByPractitionerAndDate(practitionerId, date);
}

module.exports = {
  createBlock,
  getBlocksForDate,
};
