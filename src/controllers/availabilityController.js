const availabilityRepository = require("../repositories/availabilityRepository");

/**
 * Criar disponibilidade isolada (modo antigo)
 * POST /api/practitioners/:practitionerId/availabilities
 */
async function createAvailability(req, res) {
  try {
    const practitionerId = req.params.practitionerId;
    const { dayOfWeek, startTime, endTime } = req.body;

    if (
      typeof dayOfWeek !== "number" ||
      dayOfWeek < 0 ||
      dayOfWeek > 6 ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const created = availabilityRepository.createAvailability({
      practitionerId,
      dayOfWeek,
      startTime,
      endTime,
    });

    return res.json(created);
  } catch (err) {
    console.error("Erro ao criar disponibilidade:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

/**
 * Listar disponibilidades de um profissional (rota antiga)
 * GET /api/practitioners/:practitionerId/availabilities
 */
async function listAvailabilities(req, res) {
  try {
    const practitionerId = req.params.practitionerId;
    const list =
      availabilityRepository.listAvailabilitiesByPractitioner(practitionerId);

    return res.json(list);
  } catch (err) {
    console.error("Erro ao listar disponibilidades:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

/**
 * NOVO — Listar via query
 * GET /api/availabilities?practitionerId=...
 */
async function listAvailabilitiesByQuery(req, res) {
  try {
    const practitionerId = req.query.practitionerId;

    if (!practitionerId) {
      return res.status(400).json({ error: "practitionerId é obrigatório" });
    }

    const list =
      availabilityRepository.listAvailabilitiesByPractitioner(practitionerId);

    return res.json(list);
  } catch (err) {
    console.error("Erro ao listar disponibilidades (query):", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

/**
 * NOVO — Salvar TODAS as disponibilidades em massa
 * POST /api/availabilities/bulk
 *
 * body:
 * {
 *   "practitionerId": "...",
 *   "availabilities": [
 *     { "dayOfWeek": 1, "startTime": "08:00", "endTime": "12:00" },
 *     ...
 *   ]
 * }
 */
async function saveBulkAvailabilities(req, res) {
  try {
    const { practitionerId, availabilities } = req.body;

    if (!practitionerId || !Array.isArray(availabilities)) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    // Limpa tudo do profissional
    availabilityRepository.deleteAvailabilitiesByPractitioner(practitionerId);

    // Cria todas as novas
    const created = [];
    for (const item of availabilities) {
      if (
        typeof item.dayOfWeek !== "number" ||
        item.dayOfWeek < 0 ||
        item.dayOfWeek > 6 ||
        !item.startTime ||
        !item.endTime
      ) {
        // pula intervalos inválidos
        continue;
      }

      const a = availabilityRepository.createAvailability({
        practitionerId,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
      });

      created.push(a);
    }

    return res.json(created);
  } catch (err) {
    console.error("Erro ao salvar disponibilidades em massa:", err);
    return res
      .status(500)
      .json({ error: "Erro interno ao salvar disponibilidades" });
  }
}

module.exports = {
  createAvailability,
  listAvailabilities,
  listAvailabilitiesByQuery,
  saveBulkAvailabilities,
};
