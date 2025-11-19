const availabilityService = require('../services/availabilityService');

/**
 * POST /api/practitioners/:id/availabilities
 */
async function createAvailability(req, res) {
  try {
    const practitionerId = req.params.id;

    const data = {
      practitionerId,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    };

    const availability = availabilityService.createAvailability(data);
    return res.status(201).json(availability);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/**
 * GET /api/practitioners/:id/availabilities
 */
async function listAvailabilities(req, res) {
  try {
    const practitionerId = req.params.id;
    const list = availabilityService.listAvailabilities(practitionerId);
    return res.json(list);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createAvailability,
  listAvailabilities
};
