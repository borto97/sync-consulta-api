// src/services/slotService.js

const availabilityRepository = require("../repositories/availabilityRepository");
const appointmentRepository = require("../repositories/appointmentRepository");

// Converte data (YYYY-MM-DD) → nome do dia da semana
function getDayOfWeek(dateStr) {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const d = new Date(dateStr + "T00:00:00");
  return days[d.getDay()];
}

// Converte 'HH:MM' → minutos
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Converte minutos → 'HH:MM'
function toTimeString(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

async function listAvailableSlots(practitionerId, date) {
  if (!date) {
    throw new Error("É necessário fornecer a data no formato YYYY-MM-DD.");
  }

  const dayOfWeek = getDayOfWeek(date);

  // 1. Buscar disponibilidades do dia
  const availabilities = availabilityRepository
    .list()
    .filter(
      (a) =>
        a.practitionerId === practitionerId &&
        a.dayOfWeek.toLowerCase() === dayOfWeek
    );

  if (availabilities.length === 0) {
    return {
      practitionerId,
      date,
      slots: [],
    };
  }

  // 2. Gerar todos os slots possíveis do dia (30min)
  const SLOT = 30;
  let possibleSlots = [];

  for (const av of availabilities) {
    const start = toMinutes(av.startTime);
    const end = toMinutes(av.endTime);

    for (let t = start; t + SLOT <= end; t += SLOT) {
      possibleSlots.push(toTimeString(t));
    }
  }

  // 3. Buscar agendamentos no mesmo dia
  const appointments = appointmentRepository
    .list()
    .filter((ap) => {
      const apDate = ap.startTime.split("T")[0];
      return ap.practitionerId === practitionerId && apDate === date;
    });

  const takenSlots = appointments.map((ap) => {
    const [_, time] = ap.startTime.split("T");
    return time.slice(0, 5); // HH:MM
  });

  // 4. Remover horários ocupados
  const freeSlots = possibleSlots.filter((slot) => !takenSlots.includes(slot));

  return {
    practitionerId,
    date,
    slots: freeSlots,
  };
}

module.exports = {
  listAvailableSlots,
};
