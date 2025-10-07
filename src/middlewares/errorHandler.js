// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // A veces, los errores pueden tener un código de estado que queremos usar
  const statusCode = res.statusCode ? res.statusCode : 500;

  console.error(err.stack); // Muestra el detalle del error en la consola del servidor

  res.status(statusCode).json({
    message: err.message,
    // En modo de desarrollo, podríamos querer ver más detalles del error
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};