// src/controllers/patientController.js
const patientService = require("../services/patientService");

async function getAll(req, res) {
  try {
    const { name } = req.query; // novo filtro opcional
    const patients = await patientService.getAllPatients(name);
    return res.json(patients);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    return res.json(patient);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const patient = await patientService.createPatient(req.body);
    return res.status(201).json(patient);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);
    return res.json(patient);
  } catch (err) {
    if (err.message === "Patient not found") {
      return res.status(404).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await patientService.deletePatient(req.params.id);
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
