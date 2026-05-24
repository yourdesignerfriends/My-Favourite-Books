const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My Favourite Books API',
        description: 'API for managing books'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);