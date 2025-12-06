// src/controllers/specialAvailabilityController.js
const specialAvailabilityService = require('../services/specialAvailabilityService');

async function createSpecialAvailability(req, res) {
  try {
    const practitionerId = req.params.id;
    const payload = req.body;

    const record =
      await specialAvailabilityService.createSpecialAvailability(
        practitionerId,
        payload
      );

    return res.status(201).json(record);
  } catch (err) {
    console.error('Erro ao criar disponibilidade especial:', err);

    return res.status(err.statusCode || 500).json({
      error: err.message || 'Erro interno ao criar disponibilidade especial',
    });
  }
}

module.exports = {
  createSpecialAvailability,
};
