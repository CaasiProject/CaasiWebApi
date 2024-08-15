import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Caasi",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:6060/api/v1/"
            }
        ]
    },
    apis: [
        join(__dirname, '../../src/routes/absence.routes.js'),
        join(__dirname, '../../src/routes/activity.routes.js'),
        join(__dirname, '../../src/routes/advancedSetting.routes.js'),
        join(__dirname, '../../src/routes/client.routes.js'),
        join(__dirname, '../../src/routes/expense.routes.js'),
        join(__dirname, '../../src/routes/user.routes.js'),
    ]

};

const swaggerSpec = swaggerJSDoc(options);
console.log(JSON.stringify(swaggerSpec, null, 2));
export default function SwaggerDocs(app) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Docs are available at http://localhost:6060')
}
