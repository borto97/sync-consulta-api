const recordService = require("../services/recordService");

async function createForAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    const record = recordService.createForAppointment(appointmentId, req.body);
    return res.status(201).json(record);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function listByAppointment(req, res) {
  try {
    const appointmentId = req.params.id;
    const records = recordService.listByAppointment(appointmentId);
    return res.json(records);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function listByPatient(req, res) {
  try {
    const patientId = req.params.id;
    const records = recordService.listByPatient(patientId);
    return res.json(records);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function updateRecord(req, res) {
  try {
    const recordId = req.params.recordId;
    const updated = recordService.updateRecord(recordId, req.body);
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function deleteRecord(req, res) {
  try {
    const recordId = req.params.recordId;
    await recordService.deleteRecord(recordId);
    return res.json({ success: true });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

module.exports = {
  createForAppointment,
  listByAppointment,
  listByPatient,
  updateRecord,
  deleteRecord,
};
