const errorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  
  // mongoose validation errors
  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors).map(
      (error) => `${error.path}: ${error.message}`
    );
  }

  // mongoose duplicate key error
  if(err.code === 11000){
    err.message = `email is already exist`
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'internal server error'
  });
};
