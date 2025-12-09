const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const recordController = require("../controllers/recordController");

// Criar agendamento
router.post('/', appointmentController.createAppointment);

// Listar todos os agendamentos
router.get('/', appointmentController.listAppointments);

// Listar agendamentos por profissional
router.get('/practitioner/:practitionerId', appointmentController.listAppointmentsByPractitioner);

// Listar horários ocupados
router.get('/practitioner/:practitionerId/occupied', appointmentController.listOccupied);

// Cancelar agendamento (status = CANCELLED)
router.delete('/:id', appointmentController.cancelAppointment);

// Busca avançada
router.get('/search', appointmentController.searchAppointments);

// Edição de agendamento
router.put("/:id", appointmentController.updateAppointment);

// Buscar agendamento por ID
router.get('/:id', appointmentController.getAppointmentById);

router.post("/:id/records", recordController.createForAppointment);
router.get("/:id/records", recordController.listByAppointment);

router.get("/:id/financial-entries", appointmentController.getFinancialEntries);

module.exports = router;
