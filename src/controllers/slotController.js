// src/controllers/slotController.js

const slotService = require('../services/slotService');

async function getSlotsForPractitioner(req, res) {
  try {
    const practitionerId = req.params.id;
    const { date, slot } = req.query;

    if (!practitionerId) {
      return res.status(400).json({
        message: 'Parâmetro "id" do profissional é obrigatório na URL.',
      });
    }

    if (!date) {
      return res.status(400).json({
        message: 'Parâmetro "date" é obrigatório no formato YYYY-MM-DD.',
      });
    }

    // NOVO COMPORTAMENTO:
    // Se o usuário mandou explicitamente o slot → usa esse número
    // Caso contrário → envia null para a service
    let slotSizeMinutes = null;

    if (slot !== undefined) {
      const parsed = Number(slot);

      if (!Number.isInteger(parsed) || parsed <= 0) {
        return res.status(400).json({
          message:
            'Parâmetro "slot" deve ser um número inteiro positivo representando minutos (ex.: 30, 50).',
        });
      }

      slotSizeMinutes = parsed;
    }

    const result = await slotService.getSlotsForPractitioner(
      practitionerId,
      date,
      slotSizeMinutes
    );

    return res.json(result);
  } catch (error) {
    console.error('Erro ao buscar slots:', error);
    return res.status(500).json({
      message: 'Erro ao buscar slots disponíveis.',
      error: error.message,
    });
  }
}

module.exports = {
  getSlotsForPractitioner,
};
