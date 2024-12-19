/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      Event:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *              description: Event ID
 *            name:
 *              type: string
 *              description: Event name
 *            description:
 *              type: string
 *              description: Event description
 *            date:
 *              type: string
 *              format: date
 *              description: Date of the event
 *            location:
 *              type: string
 *              description: Event location
 *            category:
 *              type: string
 *              description: Event category
 *      EventInput:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: Event name
 *            description:
 *              type: string
 *              description: Event description
 *            date:
 *              type: string
 *              format: date
 *              description: Date of the event
 *            location:
 *              type: string
 *              description: Event location
 *            category:
 *              type: string
 *              description: Event category
 *          required:
 *            - name
 *            - date
 *            - location
 */
import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';
import ticketService from '../service/ticket.service';

const eventRouter = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get a list of all events.
 *     description: Returns JSON array of events, each item in the array is of type Event.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Error occurred while fetching the list of events.
 */
eventRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        // res.status(400).json({ status: 'error' });
        next(error);
    }
});

/**
 * @swagger
 * /events/details/{id}:
 *   get:
 *     summary: Get event details by ID.
 *     description: Returns a single event by its ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to retrieve.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Event details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found.
 *       400:
 *         description: Error occurred while fetching the event details.
 */
eventRouter.get('/details/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    try {
        const event = await eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ message: `Event with id ${id} does not exist.` });
        }
        res.status(200).json(event);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', message: err.message });
    }
});

/**
 * @swagger
 * /events/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new event.
 *     description: Create a new event.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Error occurred while creating event.
 */
eventRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(200).json(event);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ status: 'error', message: err.message });
    }
});

export { eventRouter };
