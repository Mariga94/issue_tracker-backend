import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'homehub API',
            version: '1.0.0',
            description: 'API documentation for homehub application'
        },
    },
    apis: ['./routes/v1/**/*.ts']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi }