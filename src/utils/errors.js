// src/utils/errors.js

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

// middleware global de tratamento de erros
function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: "Erro interno no servidor.",
  });
}

module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  errorMiddleware,
};
