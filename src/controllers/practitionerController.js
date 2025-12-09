// src/controllers/practitionerController.js
const practitionerService = require("../services/practitionerService");

async function getAll(req, res) {
  try {
    const { name } = req.query; // novo filtro opcional
    const practitioners = await practitionerService.getAllPractitioners(name);
    return res.json(practitioners);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const practitioner = await practitionerService.getPractitionerById(req.params.id);
    return res.json(practitioner);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const practitioner = await practitionerService.createPractitioner(req.body);
    return res.status(201).json(practitioner);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const practitioner = await practitionerService.updatePractitioner(req.params.id, req.body);
    return res.json(practitioner);
  } catch (err) {
    if (err.message === "Practitioner not found") {
      return res.status(404).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await practitionerService.deletePractitioner(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
