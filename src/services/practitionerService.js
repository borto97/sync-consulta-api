// src/services/practitionerService.js
const practitionerRepo = require("../repositories/practitionerRepository");
const { BadRequestError, NotFoundError } = require("../utils/errors");

function listPractitioners() {
  return practitionerRepo.findAll();
}

function createPractitioner(data) {
  if (!data.name || !data.specialty || !data.email) {
    throw new BadRequestError(
      "name, specialty e email são obrigatórios para criar um profissional."
    );
  }

  return practitionerRepo.create(data);
}

function getPractitionerById(id) {
  const practitioner = practitionerRepo.findById(id);
  if (!practitioner) {
    throw new NotFoundError("Profissional não encontrado.");
  }
  return practitioner;
}

function updatePractitioner(id, data) {
  const updated = practitionerRepo.update(id, data);
  if (!updated) {
    throw new NotFoundError("Profissional não encontrado para atualização.");
  }
  return updated;
}

function removePractitioner(id) {
  const ok = practitionerRepo.remove(id);
  if (!ok) {
    throw new NotFoundError("Profissional não encontrado para remoção.");
  }
}

module.exports = {
  listPractitioners,
  createPractitioner,
  getPractitionerById,
  updatePractitioner,
  removePractitioner,
};
