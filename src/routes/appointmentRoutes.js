const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');

// Criar agendamento
router.post('/', appointmentController.createAppointment);

// Listar todos os agendamentos
router.get('/', appointmentController.listAppointments);

// Listar agendamentos por profissional
router.get('/practitioner/:practitionerId', appointmentController.listAppointmentsByPractitioner);

module.exports = router;
