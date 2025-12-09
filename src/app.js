// src/app.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { errorMiddleware } = require("./utils/errors");

const app = express();

// permite ler JSON no corpo das requisições
app.use(express.json());

// libera acesso ao front-end
app.use(cors());

// prefixo de todas as rotas
app.use("/api", routes);

// middleware global de erros
app.use(errorMiddleware);

module.exports = app;
