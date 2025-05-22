 
// server/middlewares/error.js

// 404 Not Found handler
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
};

// General error handler
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
