// src/services/appointmentService.js
const { dayjs, DEFAULT_TIMEZONE, normalizeStartTime } = require('../utils/time');
const appointmentRepository = require('../repositories/appointmentRepository');
const availabilityService = require('../services/availabilityService');
const practitionerRepository = require('../repositories/practitionerRepository');
const specialAvailabilityService = require('../services/specialAvailabilityService');
const blockService = require('../services/blockService');
const slotService = require("./slotService");

// ---------- Utils ----------

function intervalsOverlap(startA, endA, startB, endB) {
  const aStart = Date.parse(startA);
  const aEnd   = Date.parse(endA);
  const bStart = Date.parse(startB);
  const bEnd   = Date.parse(endB);

  if ([aStart, aEnd, bStart, bEnd].some(v => Number.isNaN(v))) {
    console.log('⚠️ DEBUG: Falha ao converter datas p/ overlap:', {
      startA, endA, startB, endB,
    });
    return false;
  }

  return aStart < bEnd && bStart < aEnd;
}

function addMinutesToISO(startIso, minutesToAdd) {
  const d = dayjs(startIso);
  if (!d.isValid()) throw new Error('startTime inválido ao calcular endTime.');
  return d.add(minutesToAdd, 'minute').format();
}

function hasConflict(practitionerId, startTime) {
  const lista = appointmentRepository
    .listAppointmentsByPractitioner(practitionerId)
    .filter((appt) => appt.status !== 'CANCELLED');

  return lista.some((appt) => appt.startTime === startTime);
}

// ---------- NOVO: função que verifica bloqueios ----------

function isInsideBlock(practitionerId, localDate, minutesFromMidnight) {
  const blocks = blockService.getBlocksForDate(practitionerId, localDate);

  return blocks.some(b => {
    const [sh, sm] = b.startTime.split(":").map(Number);
    const [eh, em] = b.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end   = eh * 60 + em;

    return minutesFromMidnight >= start && minutesFromMidnight < end;
  });
}

// ---------- Disponibilidade (agora considera bloqueios também) ----------

function isPractitionerAvailable(practitioner, startTimeIso) {
  const tz = practitioner.timezone || DEFAULT_TIMEZONE;

  const d = dayjs(startTimeIso).tz(tz);
  if (!d.isValid()) throw new Error('Data/hora inválida para verificação.');

  const days = [
    'sunday', 'monday', 'tuesday', 'wednesday',
    'thursday', 'friday', 'saturday',
  ];

  const dayOfWeek = days[d.day()];
  const localDate = d.format('YYYY-MM-DD');
  const minutes = d.hour() * 60 + d.minute();

  // 1) Disponibilidades semanais
  const weekly = availabilityService
    .listAvailabilities(practitioner.id)
    .filter(a => a.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase())

    .map(a => ({
      startTime: a.startTime,
      endTime: a.endTime
    }));

  // 2) Disponibilidades especiais
  const specials =
    specialAvailabilityService.getSpecialAvailabilitiesForDate(practitioner.id, localDate)
      .map(s => ({
        startTime: s.startTime,
        endTime: s.endTime
      }));

  const combined = [...weekly, ...specials];

  // Nenhuma disponibilidade → indisponível
  if (combined.length === 0) return false;

  // 3) Remover horários que estão DENTRO de bloqueios
  if (isInsideBlock(practitioner.id, localDate, minutes)) {
    return false; // <-- bloqueado
  }

  // 4) Verificar se está dentro de qualquer período disponível
  const isInsideAvailability = combined.some(a => {
    const [sh, sm] = a.startTime.split(':').map(Number);
    const [eh, em] = a.endTime.split(':').map(Number);

    const start = sh * 60 + sm;
    const end   = eh * 60 + em;

    return minutes >= start && minutes < end;
  });

  return isInsideAvailability;
}

// ---------- Core ----------

async function createAppointment(data) {
  if (!data.practitionerId) throw new Error('practitionerId é obrigatório');
  if (!data.patientName) throw new Error('patientName é obrigatório');
  if (!data.patientPhone) throw new Error('patientPhone é obrigatório');
  if (!data.startTime) throw new Error('startTime é obrigatório');

  const practitioner = practitionerRepository.findById(data.practitionerId);
  if (!practitioner) throw new Error('Professional not found.');

  const tz = practitioner.timezone || DEFAULT_TIMEZONE;
  const normalizedStart = normalizeStartTime(data.startTime, tz);

 // ---------- Disponibilidade unificada (mesma lógica de slots) ----------
  const available = await isPractitionerAvailableUnified(practitioner, normalizedStart);
  if (!available) {
  throw new Error('Profissional não disponível neste horário.');
  }

  // Conflito direto
  if (hasConflict(data.practitionerId, normalizedStart)) {
    throw new Error('Horário já agendado para este profissional.');
  }

  // Duração
  let duration = data.duration != null
    ? Number(data.duration)
    : practitioner.defaultSessionDuration || 50;

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('duration deve ser número positivo.');
  }

  const endTime = addMinutesToISO(normalizedStart, duration);

  // Conflitos parciais
  const existing = appointmentRepository
    .listAppointmentsByPractitioner(data.practitionerId)
    .filter(a => a.status !== 'CANCELLED');

  const partialConflict = existing.some(a =>
    intervalsOverlap(normalizedStart, endTime, a.startTime, a.endTime)
  );

  if (partialConflict) {
    throw new Error(
      `Conflito de horário: ${normalizedStart} → ${endTime} sobrepõe outro agendamento.`
    );
  }

  return appointmentRepository.createAppointment({
    ...data,
    startTime: normalizedStart,
    endTime,
    duration,
  });
}

function listAppointments() {
  return appointmentRepository.list();
}

function listAppointmentsByPractitioner(id) {
  return appointmentRepository.listAppointmentsByPractitioner(id);
}

function getOccupiedByDay(practitionerId, dateStr) {
  const all = appointmentRepository
    .listAppointmentsByPractitioner(practitionerId)
    .filter(a => a.status !== 'CANCELLED');

  return all
    .filter(a => a.startTime.startsWith(dateStr))
    .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
}

function cancelAppointment(id) {
  const existing = appointmentRepository.findById(id);
  if (!existing) throw new Error('Agendamento não encontrado.');

  if (existing.status === 'CANCELLED') return existing;

  return appointmentRepository.update({ ...existing, status: 'CANCELLED' });
}

function searchAppointments(filters) {
  const { patientName, professionalName, ...rest } = filters;

  const normalized = {
    ...rest,
    patientName: patientName ? patientName.toLowerCase() : null,
    professionalName: null,
    practitionerIds: null,
  };

  // Se veio filtro por nome do profissional → converter para IDs
  if (professionalName) {
    const q = professionalName.toLowerCase();

    const allProfessionals = practitionerRepository.findAll();

    const matching = allProfessionals
      .filter((p) => p.name.toLowerCase().includes(q))
      .map((p) => p.id);

    normalized.practitionerIds = matching;
  }

  // Se não veio, practitionerIds permanece null

  return appointmentRepository.search(normalized);
}

async function isPractitionerAvailableUnified(practitioner, startTimeIso) {
  try {
    if (!practitioner || !practitioner.id) {
      console.log("🟥 [DEBUG] practitioner inválido:", practitioner);
      return false;
    }

    const tz = practitioner.timezone || DEFAULT_TIMEZONE;

    const d = dayjs(startTimeIso).tz(tz);
    if (!d.isValid()) {
      console.log("🟥 [DEBUG] startTimeIso inválido:", startTimeIso);
      return false;
    }

    const date = d.format("YYYY-MM-DD");
    const time = d.format("HH:mm");

    console.log("🟦 [DEBUG] Verificando disponibilidade unificada:");
    console.log("     → profissional:", practitioner.id);
    console.log("     → data:", date);
    console.log("     → horário:", time);

    // 🔥 nova regra: slotService decide tudo
    const result = await slotService.getSlotsForPractitioner(practitioner.id, date);

    console.log("🟦 [DEBUG] slots gerados:", result.slots);

    const isFree = result.slots.includes(time);

    console.log("🟩 [DEBUG] horário disponível?", isFree);

    return isFree;
  } catch (err) {
    console.log("🟥 [DEBUG] ERRO EM isPractitionerAvailableUnified:", err);
    return false;
  }
}

// ---------- Buscar agendamento por ID ----------
function getAppointmentById(id) {
  const appt = appointmentRepository.findById(id);
  if (!appt) {
    const err = new Error("Agendamento não encontrado.");
    err.statusCode = 404;
    throw err;
  }
  return appt;
}

// ================================================
// UPDATE APPOINTMENT (com histórico completo)
// ================================================
async function updateAppointment(appointmentId, data) {
  if (!appointmentId) {
    const err = new Error("appointmentId é obrigatório.");
    err.statusCode = 400;
    throw err;
  }

  // Buscar agendamento existente
  const existing = appointmentRepository.findById(appointmentId);
  if (!existing) {
    const err = new Error("Agendamento não encontrado.");
    err.statusCode = 404;
    throw err;
  }

  // Profissional (não pode ser alterado)
  const practitioner = practitionerRepository.findById(existing.practitionerId);
  if (!practitioner) {
    const err = new Error("Professional not found.");
    err.statusCode = 404;
    throw err;
  }

  const tz = practitioner.timezone || DEFAULT_TIMEZONE;

  // Snapshot para histórico e para slots "antigos"
  const old = { ...existing };

  // =============================
  // 1) Atualizar campos simples
  // =============================
  const updatable = ["patientName", "patientPhone", "notes"];

  updatable.forEach((field) => {
    if (data[field] != null && data[field] !== existing[field]) {
      existing[field] = data[field];
      existing.history = existing.history || [];
      existing.history.push({
        field,
        oldValue: old[field],
        newValue: data[field],
        changedAt: new Date().toISOString(),
        source: "manual",
      });
    }
  });

  // ===========================================
  // 2) Atualizar startTime (se enviado)
  // ===========================================
  let normalizedStart = existing.startTime;

  if (data.startTime != null) {
    const newStart = normalizeStartTime(data.startTime, tz);

    // disponibilidade unificada p/ o novo início
    const available = await isPractitionerAvailableUnified(practitioner, newStart);
    if (!available) {
      const err = new Error("Profissional não disponível neste horário.");
      err.statusCode = 400;
      throw err;
    }

    // verificar conflito direto (ignorar a si mesmo)
    const directConflict = appointmentRepository
      .listAppointmentsByPractitioner(existing.practitionerId)
      .filter((a) => a.id !== appointmentId && a.status !== "CANCELLED")
      .some((a) => a.startTime === newStart);

    if (directConflict) {
      const err = new Error("Horário já está ocupado por outro agendamento.");
      err.statusCode = 400;
      throw err;
    }

    existing.history = existing.history || [];
    existing.history.push({
      field: "startTime",
      oldValue: existing.startTime,
      newValue: newStart,
      changedAt: new Date().toISOString(),
      source: "manual",
    });

    normalizedStart = newStart;
    existing.startTime = newStart;
  }

  // ====================================
  // 3) Duração (duration)
  // ====================================
  let newDuration = existing.duration;
  if (data.duration != null) {
    const parsed = Number(data.duration);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      const err = new Error("duration deve ser positivo.");
      err.statusCode = 400;
      throw err;
    }

    if (parsed !== existing.duration) {
      existing.history = existing.history || [];
      existing.history.push({
        field: "duration",
        oldValue: existing.duration,
        newValue: parsed,
        changedAt: new Date().toISOString(),
        source: "manual",
      });
      newDuration = parsed;
      existing.duration = parsed;
    }
  }

  // ====================================
  // 4) Recalcular endTime
  // ====================================
  const newEndTime = addMinutesToISO(normalizedStart, newDuration);

  // ------------------------------------
  // 🔥 Validação completa via slots
  // ------------------------------------

  // data local do início
  const dateLocal = dayjs(normalizedStart).tz(tz).format("YYYY-MM-DD");

  // slots "oficiais" do dia (sem este appointment)
  const { slots } = await slotService.getSlotsForPractitioner(
    existing.practitionerId,
    dateLocal
  );

  // helper p/ gerar slots HH:mm de 5 em 5 min em um intervalo
  function generateIntervalSlots(startIso, endIso) {
    const result = [];
    let cursor = dayjs(startIso).tz(tz);
    const end = dayjs(endIso).tz(tz);

    while (cursor.isBefore(end)) {
      result.push(cursor.format("HH:mm"));
      cursor = cursor.add(5, "minute");
    }
    return result;
  }

  // slots antigos deste próprio appointment (antes do update)
  const oldIntervalSlots = generateIntervalSlots(old.startTime, old.endTime);

  // slots do novo intervalo proposto
  const intervalSlots = generateIntervalSlots(normalizedStart, newEndTime);

  // união: slots do dia + slots antigos deste appointment
  const allowedSet = new Set([...slots, ...oldIntervalSlots]);

  const allAvailable = intervalSlots.every((hhmm) => allowedSet.has(hhmm));

  if (!allAvailable) {
    const err = new Error("Profissional não disponível neste horário.");
    err.statusCode = 400;
    throw err;
  }

  // ------------------------------------
  // ⚠️ Verificação de conflitos parciais
  // ------------------------------------
  const partialConflict = appointmentRepository
    .listAppointmentsByPractitioner(existing.practitionerId)
    .filter((a) => a.id !== appointmentId && a.status !== "CANCELLED")
    .some((a) =>
      intervalsOverlap(normalizedStart, newEndTime, a.startTime, a.endTime)
    );

  if (partialConflict) {
    const err = new Error("O horário escolhido sobrepõe outro agendamento.");
    err.statusCode = 400;
    throw err;
  }

  // ------------------------------------
  // Histórico de endTime (se mudou)
  // ------------------------------------
  if (existing.endTime !== newEndTime) {
    existing.history = existing.history || [];
    existing.history.push({
      field: "endTime",
      oldValue: existing.endTime,
      newValue: newEndTime,
      changedAt: new Date().toISOString(),
      source: "manual",
    });
  }

  existing.endTime = newEndTime;

  // Atualizar updatedAt
  existing.updatedAt = new Date().toISOString();

  // Persistir (em memória)
  const updated = appointmentRepository.update(existing);

  return updated;
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByPractitioner,
  getOccupiedByDay,
  cancelAppointment,
  searchAppointments,
  updateAppointment,
  getAppointmentById,
};
