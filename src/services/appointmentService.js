const appointmentRepository = require('../repositories/appointmentRepository');
const availabilityService = require('../services/availabilityService');

function hasConflict(practitionerId, startTime) {
  const lista = appointmentRepository.listAppointmentsByPractitioner(practitionerId);
  return lista.some((appt) => appt.startTime === startTime);
}

// Converte ISO startTime + disponibilidades em "está / não está disponível"
function isPractitionerAvailable(practitionerId, startTimeIso) {
  const date = new Date(startTimeIso);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Data/hora inválida.');
  }

  // mapear dia da semana para o formato salvo na disponibilidade
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const dayOfWeek = days[date.getDay()];

  // pegar todas as disponibilidades do profissional
  const allAvailabilities = availabilityService.listAvailabilities(practitionerId);

  // filtrar só as do dia correspondente
  const dayAvailabilities = allAvailabilities.filter(
    (a) => a.dayOfWeek === dayOfWeek
  );

  // se não tiver nenhuma disponibilidade nesse dia → indisponível
  if (dayAvailabilities.length === 0) {
    return false;
  }

  // horário do agendamento em minutos desde 00:00
  const minutes = date.getHours() * 60 + date.getMinutes();

  // verifica se cai dentro de pelo menos um intervalo [startTime, endTime)
  const isInside = dayAvailabilities.some((a) => {
    const [sh, sm] = a.startTime.split(':').map(Number); // ex: '09:00'
    const [eh, em] = a.endTime.split(':').map(Number);   // ex: '12:00'

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return minutes >= startMinutes && minutes < endMinutes;
  });

  return isInside;
}

function createAppointment(data) {
  if (!data.practitionerId) throw new Error('practitionerId é obrigatório');
  if (!data.patientName) throw new Error('patientName é obrigatório');
  if (!data.patientPhone) throw new Error('patientPhone é obrigatório');
  if (!data.startTime) throw new Error('startTime é obrigatório');

  // 1) Verifica se o profissional está disponível nesse dia/horário
  const available = isPractitionerAvailable(data.practitionerId, data.startTime);
  if (!available) {
    throw new Error('Profissional não disponível neste horário.');
  }

  // 2) Verifica conflito com outro agendamento no mesmo horário
  if (hasConflict(data.practitionerId, data.startTime)) {
    throw new Error('Horário já agendado para este profissional.');
  }

  // 3) Cria agendamento
  return appointmentRepository.createAppointment(data);
}

function listAppointments() {
  return appointmentRepository.listAppointments();
}

function listAppointmentsByPractitioner(practitionerId) {
  if (!practitionerId) throw new Error('practitionerId é obrigatório');
  return appointmentRepository.listAppointmentsByPractitioner(practitionerId);
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByPractitioner,
};
