// src/config/env.js
const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
  });
}

module.exports = { loadEnv };
