const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Criar disponibilidade
router.post('/:id/availabilities', availabilityController.createAvailability);

// Listar disponibilidades
router.get('/:id/availabilities', availabilityController.listAvailabilities);

module.exports = router;
