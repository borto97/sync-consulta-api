// src/controllers/practitionerController.js[]
const practitionerService = require("../services/practitionerService");

async function list(req, res, next) {
  try {
    const data = practitionerService.listPractitioners();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const practitioner = practitionerService.createPractitioner(req.body);
    res.status(201).json(practitioner);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const practitioner = practitionerService.getPractitionerById(req.params.id);
    res.json(practitioner);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const practitioner = practitionerService.updatePractitioner(
      req.params.id,
      req.body
    );
    res.json(practitioner);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await practitionerService.removePractitioner(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  create,
  getById,
  update,
  remove,
};
