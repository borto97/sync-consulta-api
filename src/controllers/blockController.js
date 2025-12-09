// src/controllers/blockController.js
const blockService = require('../services/blockService');

async function createBlock(req, res) {
  try {
    const practitionerId = req.params.id;
    const payload = req.body;

    const block = await blockService.createBlock(practitionerId, payload);

    return res.status(201).json(block);
  } catch (err) {
    console.error('Erro ao criar bloqueio:', err);
    const status = err.statusCode || 500;

    return res.status(status).json({
      error: err.message || 'Erro ao criar bloqueio.',
    });
  }
}

async function getBlocks(req, res) {
  try {
    const practitionerId = req.params.id;
    const date = req.query.date;

    if (!date) {
      return res
        .status(400)
        .json({ error: 'Parâmetro "date" é obrigatório no formato YYYY-MM-DD.' });
    }

    const blocks = blockService.getBlocksForDate(practitionerId, date);

    return res.json(blocks);
  } catch (err) {
    console.error('Erro ao consultar bloqueios:', err);
    const status = err.statusCode || 500;

    return res.status(status).json({
      error: err.message || 'Erro ao consultar bloqueios.',
    });
  }
}

module.exports = {
  createBlock,
  getBlocks,
};
