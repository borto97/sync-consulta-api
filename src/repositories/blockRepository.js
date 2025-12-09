// src/repositories/blockRepository.js
const { v4: uuidv4 } = require('uuid');

/**
 * Estrutura armazenada:
 * {
 *   id: string,
 *   practitionerId: string,
 *   date: "YYYY-MM-DD",
 *   startTime: "HH:mm",
 *   endTime: "HH:mm",
 *   createdAt: ISO,
 *   updatedAt: ISO
 * }
 */

let blocks = [];

function create({ practitionerId, date, startTime, endTime }) {
  const now = new Date().toISOString();

  const block = {
    id: uuidv4(),
    practitionerId,
    date,
    startTime,
    endTime,
    createdAt: now,
    updatedAt: now,
  };

  blocks.push(block);
  return block;
}

function findByPractitionerAndDate(practitionerId, date) {
  return blocks.filter(
    (b) => b.practitionerId === practitionerId && b.date === date
  );
}

function listByPractitioner(practitionerId) {
  return blocks.filter((b) => b.practitionerId === practitionerId);
}

function clearAll() {
  blocks = [];
}

module.exports = {
  create,
  findByPractitionerAndDate,
  listByPractitioner,
  clearAll,
};
