// src/repositories/specialAvailabilityRepository.js
const { v4: uuidv4 } = require('uuid');

/**
 * Estrutura base (em memória):
 * {
 *   id: string,
 *   practitionerId: string,
 *   date: 'YYYY-MM-DD',
 *   startTime: 'HH:mm',
 *   endTime: 'HH:mm',
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 */

let specialAvailabilities = [];

function create({ practitionerId, date, startTime, endTime }) {
  const now = new Date().toISOString();

  const record = {
    id: uuidv4(),
    practitionerId,
    date,
    startTime,
    endTime,
    createdAt: now,
    updatedAt: now,
  };

  specialAvailabilities.push(record);
  return record;
}

function findByPractitionerAndDate(practitionerId, date) {
  return specialAvailabilities.filter(
    (item) => item.practitionerId === practitionerId && item.date === date
  );
}

function findByPractitioner(practitionerId) {
  return specialAvailabilities.filter(
    (item) => item.practitionerId === practitionerId
  );
}

// útil pra testes automatizados
function clearAll() {
  specialAvailabilities = [];
}

module.exports = {
  create,
  findByPractitionerAndDate,
  findByPractitioner,
  clearAll,
};
