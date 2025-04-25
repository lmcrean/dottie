module.exports = async function (context, req) {
  context.log('Health check function processed a request');

  context.res = {
    status: 200,
    body: { 
      status: 'ok', 
      environment: process.env.NODE_ENV || 'development',
      service: 'Dottie API',
      version: '1.0.0'
    }
  };
}; 