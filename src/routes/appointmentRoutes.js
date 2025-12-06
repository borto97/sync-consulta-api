const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');

// Criar agendamento
router.post('/', appointmentController.createAppointment);

// Listar todos os agendamentos
router.get('/', appointmentController.listAppointments);

// Listar agendamentos por profissional
router.get('/practitioner/:practitionerId', appointmentController.listAppointmentsByPractitioner);

// Listar horários ocupados
router.get('/practitioner/:practitionerId/occupied', appointmentController.listOccupied);

// 🔥 Cancelar agendamento (status = CANCELLED)
router.delete('/:id', appointmentController.cancelAppointment);

// Busca avançada
router.get('/search', appointmentController.searchAppointments);

// Edição de agendamento
router.put("/:id", appointmentController.updateAppointment);

// 🔥 NOVO — Buscar agendamento por ID
router.get('/:id', appointmentController.getAppointmentById);

module.exports = router;
