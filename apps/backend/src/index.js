import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// import bodyParser from 'body-parser';
import cors from 'cors';
import tours from './routes/tours';
import cities from './routes/cities';
import language from './routes/language';
import authenticate from "./middlewares/authenticate";
import {getZuugleCors, hostMiddleware} from "./utils/zuugleCors";
import searchPhrases from "./routes/searchPhrases";

process.env.TZ = 'Europe/Berlin';

/* start api */
let port = 8080;
console.log("__dirname=", __dirname)
console.log("process.env.NODE_ENV", process.env.NODE_ENV)

if(process.env.NODE_ENV === "production"){
    if (__dirname.includes("/dev-api")) {
        port = 7070;
    }
    else {
        port = 6060;
    }
}

let corsOptions = getZuugleCors();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Zuugle API',
            version: '1.0.0',
            description: 'API documentation for Zuugle Backend',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Local server',
            },
            {
                url: 'https://dev.zuugle.at',
                description: 'DEV server',
            },
            // UAT
            { url: 'https://www2.zuugle.at', description: 'UAT server (AT)' },
            { url: 'https://www2.zuugle.de', description: 'UAT server (DE)' },
            { url: 'https://www2.zuugle.si', description: 'UAT server (SI)' },
            { url: 'https://www2.zuugle.it', description: 'UAT server (IT)' },
            { url: 'https://www2.zuugle.ch', description: 'UAT server (CH)' },
            { url: 'https://www2.zuugle.li', description: 'UAT server (LI)' },
            { url: 'https://www2.zuugle.fr', description: 'UAT server (FR)' },
            // PROD
            { url: 'https://www.zuugle.at', description: 'PROD server (AT)' },
            { url: 'https://www.zuugle.de', description: 'PROD server (DE)' },
            { url: 'https://www.zuugle.si', description: 'PROD server (SI)' },
            { url: 'https://www.zuugle.it', description: 'PROD server (IT)' },
            { url: 'https://www.zuugle.ch', description: 'PROD server (CH)' },
            { url: 'https://www.zuugle.li', description: 'PROD server (LI)' },
            { url: 'https://www.zuugle.fr', description: 'PROD server (FR)' },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

let app = express();

process.setMaxListeners(0);
// app.use(bodyParser.json({limit: '1024mb'}));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json({limit: '1024mb'}));
app.use(express.urlencoded({limit: '1024mb',extended: false}));

// preflight options requests for json files fail otherwise
app.options("/public/*", cors(corsOptions));
//static file access
app.use("/public", cors(corsOptions), express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/tours', cors(corsOptions), hostMiddleware, authenticate, tours);
app.use('/api/cities', cors(corsOptions), hostMiddleware, authenticate, cities);
app.use('/api/language', cors(corsOptions), hostMiddleware, authenticate, language);
app.use('/api/searchPhrases', cors(corsOptions), hostMiddleware, authenticate, searchPhrases);


app.listen(port, () => console.log('Running on localhost:' + port));