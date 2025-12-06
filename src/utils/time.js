const dayjs = require('../lib/dayjs');

const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

// Parse flexível de entrada
function parseFlexible(raw) {
  if (typeof raw !== 'string') {
    throw new Error('startTime deve ser uma string.');
  }

  // 1) Formato BR DD/MM/YYYY HH:mm
  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})[ T](\d{2}):(\d{2})$/);
  if (m) {
    const [, DD, MM, YYYY, hh, mm] = m;
    const iso = `${YYYY}-${MM}-${DD}T${hh}:${mm}:00`;
    const parsed = dayjs(iso);
    if (parsed.isValid()) return parsed;
  }

  // 2) ISO direto
  let d = dayjs(raw);
  if (d.isValid()) return d;

  // 3) Outros formatos
  const formats = [
    'YYYY-MM-DD HH:mm',
    'YYYY-MM-DDTHH:mm',
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY/MM/DD HH:mm',
  ];

  for (const f of formats) {
    d = dayjs(raw, f, true);
    if (d.isValid()) return d;
  }

  throw new Error('Formato de startTime inválido.');
}

// Normalização para timezone do profissional
function normalizeStartTime(raw, practitionerTimezone) {
  const tz = practitionerTimezone || DEFAULT_TIMEZONE;
  const base = parseFlexible(raw);

  const hasOffset =
    /[zZ]$/.test(raw) ||
    /[+-]\d{2}:?\d{2}$/.test(raw);

  let zoned;

  if (hasOffset) {
    zoned = base.tz(tz);
  } else {
    const isoPlain = base.format('YYYY-MM-DDTHH:mm:ss');
    zoned = dayjs.tz(isoPlain, tz);
  }

  if (!zoned.isValid()) {
    throw new Error("Não foi possível normalizar o startTime para o timezone do profissional.");
  }

  return zoned.format();
}

const { getTimeZones } = require('@vvo/tzdb');

function normalizeTimezone(tzRaw) {
  if (!tzRaw) return DEFAULT_TIMEZONE;

  if (typeof tzRaw !== 'string') {
    throw new Error("timezone deve ser uma string.");
  }

  const tz = tzRaw.trim();

  // Lista oficial de timezones IANA (cerca de 600)
  const valid = getTimeZones().some(t => t.name === tz);

  if (!valid) {
    throw new Error("timezone inválido. Use um identificador IANA, ex: America/Sao_Paulo.");
  }

  return tz;
}

module.exports = {
  dayjs,
  DEFAULT_TIMEZONE,
  normalizeStartTime,
  normalizeTimezone,
};
