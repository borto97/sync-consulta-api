// src/services/slotService.js

const availabilityRepository = require("../repositories/availabilityRepository");
const appointmentRepository = require("../repositories/appointmentRepository");
const practitionerRepository = require("../repositories/practitionerRepository");
const specialAvailabilityService = require("../services/specialAvailabilityService");
const blockService = require("../services/blockService");

// -------------------------------------------
// CONFIGURAÇÃO GLOBAL
// -------------------------------------------

// granularidade fixa: 5 minutos
const SLOT_GRANULARITY = 5;

// logs opcionais
const DEBUG = true;

// -------------------------------------------
// UTILITÁRIOS
// -------------------------------------------

function log(...msg) {
  if (DEBUG) console.log("🟦 SLOT DEBUG:", ...msg);
}

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

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function toTimeString(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

// -------------------------------------------
// REMOVE SLOTS DENTRO DE BLOQUEIOS
// -------------------------------------------

function applyBlocks(slots, blocks) {
  const blockIntervals = blocks.map((b) => ({
    start: toMinutes(b.startTime),
    end: toMinutes(b.endTime),
  }));

  return slots.filter((slot) => {
    const slotMin = toMinutes(slot);
    return !blockIntervals.some(
      (b) => slotMin >= b.start && slotMin < b.end
    );
  });
}

// -------------------------------------------
// COLETA DISPONIBILIDADES DO DIA
// -------------------------------------------

async function getDailyAvailabilities(practitionerId, date) {
  const day = getDayOfWeek(date);

  const weekly = availabilityRepository
  .listAvailabilitiesByPractitioner(practitionerId)
  .filter(a => {
      // a.dayOfWeek é número (0-6). getDayOfWeek retorna string ("monday")
      const repoDay = Number(a.dayOfWeek);

      // converter "monday" → 1, "tuesday" → 2 etc.
      const map = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      };

      return repoDay === map[day];
      });


  const specials =
    specialAvailabilityService.getSpecialAvailabilitiesForDate(
      practitionerId,
      date
    );

  const all = [
    ...weekly,
    ...specials,
  ]
    .map((a) => ({
      startTime: a.startTime,
      endTime: a.endTime,
    }))
    .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));

  return all;
}

// -------------------------------------------
// GERA SLOTS DE 5 MINUTOS DENTRO DAS AVAILABILITIES
// -------------------------------------------

function generateSlots(availabilities) {
  const slots = [];

  for (const av of availabilities) {
    const start = toMinutes(av.startTime);
    const end = toMinutes(av.endTime);

    for (
      let t = start;
      t + SLOT_GRANULARITY <= end;
      t += SLOT_GRANULARITY
    ) {
      slots.push(toTimeString(t));
    }
  }

  log("slots gerados:", slots);
  return slots;
}

// -------------------------------------------
// REMOVE HORÁRIOS JÁ AGENDADOS (por intervalos)
// -------------------------------------------

function removeTakenSlots(slots, appointments) {
  const taken = [];

  for (const appt of appointments) {
    const start = toMinutes(appt.startTime.split("T")[1].slice(0, 5));
    const end = toMinutes(appt.endTime.split("T")[1].slice(0, 5));

    for (let t = start; t < end; t += SLOT_GRANULARITY) {
      taken.push(toTimeString(t));
    }
  }

  log("slots ocupados:", taken);

  return slots.filter((slot) => !taken.includes(slot));
}

// -------------------------------------------
// FUNÇÃO PRINCIPAL
// -------------------------------------------

async function getSlotsForPractitioner(
  practitionerId,
  date
) {
  if (!practitionerId) throw new Error("practitionerId é obrigatório.");
  if (!date) throw new Error("data é obrigatória (YYYY-MM-DD).");

  const practitioner = practitionerRepository.findById(practitionerId);
  if (!practitioner) throw new Error("Professional not found.");

  const availabilities = await getDailyAvailabilities(practitionerId, date);

  if (availabilities.length === 0) {
    return { practitionerId, date, slots: [] };
  }

  // 1. gerar slots brutos (5 em 5 min)
  let slots = generateSlots(availabilities);

  // 2. remover slots dentro de appointments existentes
  const appointments = appointmentRepository
    .list()
    .filter((a) => a.practitionerId === practitionerId)
    .filter((a) => a.startTime.startsWith(date));

  slots = removeTakenSlots(slots, appointments);

  // 3. aplicar bloqueios
  const blocks = blockService.getBlocksForDate(practitionerId, date);
  slots = applyBlocks(slots, blocks);

  log("slots finais:", slots);

  return {
    practitionerId,
    date,
    slotGranularity: SLOT_GRANULARITY,
    slots,
  };
}

// -------------------------------------------

module.exports = {
  getSlotsForPractitioner,
};
