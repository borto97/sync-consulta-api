// src/controllers/slotController.js

const slotService = require("../services/slotService");

async function getSlots(req, res) {
  try {
    const practitionerId = req.params.id;
    const { date } = req.query;

    const result = await slotService.listAvailableSlots(practitionerId, date);

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getSlots,
};
