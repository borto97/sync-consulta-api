// src/server.js
const http = require("http");
const app = require("./app");
const { loadEnv } = require("./config/env");

// carrega variáveis do .env
loadEnv();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`SyncConsulta API rodando na porta ${PORT}`);
});
