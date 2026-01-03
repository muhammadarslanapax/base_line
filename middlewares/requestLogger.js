// middlewares/requestLogger.js

const requestLogger = (req, res, next) => {
    // Get client IP from headers or connection
    const clientIP =
      (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      req.ip ||
      'Unknown IP';
  
    // Log object
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      clientIP,
      userAgent: req.headers['user-agent'] || 'N/A',
      params: req.params || {},
      query: req.query || {},
      body: req.body || {},
    };
  
    // Pretty print
    console.log('\n--- Incoming Request ---');
    console.log('Timestamp :', log.timestamp);
    console.log('Method    :', log.method);
    console.log('URL       :', log.url);
    console.log('Client IP :', log.clientIP);
    console.log('User-Agent:', log.userAgent);
    console.log('Params    :', log.params);
    console.log('Query     :', log.query);
    console.log('Body      :', log.body);
    console.log('------------------------\n');
  
    next();
  };
  
  module.exports = requestLogger;
  