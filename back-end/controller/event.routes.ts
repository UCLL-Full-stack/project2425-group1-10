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
 */

import express, { NextFunction, Request, Response } from 'express';
import eventService from '../service/event.service';

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
        const events = eventService.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ status: 'error' });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID.
 *     description: Returns an event.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Numeric ID of the event to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An event object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Error occurred while fetching the event.
 */
eventRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    try {
        const event = eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ message: `Event with id ${id} does not exist.` });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Could not fetch event.' });
    }
});

eventRouter.put('/:id/:email', async (req: Request, res: Response, next: NextFunction) => {
    const eventId = parseInt(req.params.id, 10);
    const email = req.params.email;

    try {
        eventService.addParticipantToEvent(email, eventId);
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Could not add participant to event.' });
    }
});

export { eventRouter };
