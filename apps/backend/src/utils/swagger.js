import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zuugle API Documentation',
      version: packageJson.version,
      description: 'API documentation for the Zuugle backend. This documentation is automatically generated from the code.',
    },
    servers: [
      {
        url: 'https://www2.zuugle.at',
        description: 'UAT Server',
      },
      {
        url: 'https://www.zuugle.at',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:8080',
        description: 'Local Development',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // JSON Endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
