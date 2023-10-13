'use strict';

require('dotenv').config();

// Import the required packages
const createError = require('http-errors');
const express = require('express');
var cors = require('cors')
const logger = require('morgan');
const basicAuth = require('express-basic-auth')
const config = require('./config/app');

// Import swagger modules
let swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Create the App
const app = express();

app.use(cors());

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Set defaults
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'KoreConX API',
            version: '1.0',
            description: 'KoreConX API documentation',
        },
        host: config.app_url,
        basePath: '/',
        components: {
            securitySchemes: {
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                    basicFormat: 'Basic <user:password>'
                }
            }
        },
        security: [{
            basicAuth: []
        }],
        defaultModelsExpandDepth: 1
    },
    apis: ['./docs/*.yaml', './docs/*/*.yaml'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: false }));

// Swagger definition
const swaggerDefinition = {
    swagger: '2.0',
    info: {
        // API informations (required)
        title: 'KoreConX API', // Title (required)
        version: '1.0', // Version (required)
        description: 'KoreConX API documentation', // Description (optional)
    },
    host: config.app_url,
    basePath: '/'
};

const swaggerOptions2 = {
    swaggerDefinition,
    apis: ['./models/*.yaml', './models/*/*.yaml'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec2 = swaggerJSDoc(swaggerOptions2);
app.use('/api/models', swaggerUi.serve, swaggerUi.setup(swaggerSpec2));

let UnauthorizedResponse = (req) => {
    return {
        message: "Please authorize the request. User and password are missing."
    };
}

app.use('/korecontract', require('./src/kore-contract/kore-contract.routes'));
app.use('/go', require('./src/go/go.route'));

// BasicAuth Middleware
app.use(basicAuth({
    users: config.swaggerCredential,
    unauthorizedResponse: UnauthorizedResponse
}));

// Set routes
app.use('/fabric', require('./src/fabric/fabric.ca.client.routes'));
app.use('/main', require('./src/main/main.routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        data: err
    });
});

module.exports = app;