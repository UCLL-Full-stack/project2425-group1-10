import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { eventRouter } from './controller/event.routes';
import participantRouter from './controller/participant.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Events API',
            version: '1.0.0',
            description: 'API for managing events',
        },
    },
    apis: ['./controller/*.routes.ts'], // Pad naar je routebestanden met Swagger-documentatie
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/project-swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/status', (req: Request, res: Response) => {
    res.json({ message: 'Back-end is running...' });
});


app.use('/events', eventRouter);
app.use('/participants', participantRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ status: 'error', message: err.message });
});


app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});