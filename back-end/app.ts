import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { eventRouter } from './controller/event.routes';
// import { participantRouter } from './controller/participant.routes';
import { userRouter } from './controller/user.routes';
import { ticketRouter } from './controller/ticket.routes';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';


const app = express();
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            // Allow connections to own server and the external API
            connectSrc: ["'self'", 'https://api.ucll.be'],
        },
    })
);

dotenv.config();
const port = process.env.APP_PORT || 3000;


app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/api-docs',
            /^\/api-docs\/.*/,
            '/events',
            /^\/events\/details\/.*/,
            '/users/login',
            '/status',
            '/users/signup'
        ],
    })
);

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
app.use('/users', userRouter);
app.use('/tickets', ticketRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Invalid token' });
    } else if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Application error.' });
    }
});

app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});