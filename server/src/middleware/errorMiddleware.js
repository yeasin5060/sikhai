export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (res.headersSent) return;

  const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }
  if (status >= 500) console.error(error);
  return res.status(status).json({
    message: status >= 500 ? 'Internal server error' : error.message,
  });
}
