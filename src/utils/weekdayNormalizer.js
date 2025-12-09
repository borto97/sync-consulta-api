/**
 * Normaliza qualquer formato de dia da semana para:
 * "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
 */

const map = {
  // Inglês
  "sunday": "sunday",
  "monday": "monday",
  "tuesday": "tuesday",
  "wednesday": "wednesday",
  "thursday": "thursday",
  "friday": "friday",
  "saturday": "saturday",

  // Português
  "domingo": "sunday",
  "segunda": "monday",
  "segunda-feira": "monday",
  "terça": "tuesday",
  "terça-feira": "tuesday",
  "quarta": "wednesday",
  "quarta-feira": "wednesday",
  "quinta": "thursday",
  "quinta-feira": "thursday",
  "sexta": "friday",
  "sexta-feira": "friday",
  "sábado": "saturday",
  "sabado": "saturday",

  // Abreviações
  "dom": "sunday",
  "seg": "monday",
  "ter": "tuesday",
  "qua": "wednesday",
  "qui": "thursday",
  "sex": "friday",
  "sab": "saturday"
};

function normalizeWeekday(input) {
  if (!input) return null;

  // números: 0–6 (JS) ou 1–7
  if (typeof input === "number") {
    const corrected = (input === 0 ? 7 : input);
    const numMap = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      7: "sunday"
    };
    return numMap[corrected] || null;
  }

  if (typeof input === "string") {
    const key = input.trim().toLowerCase();
    return map[key] || null;
  }

  return null;
}

module.exports = { normalizeWeekday };
