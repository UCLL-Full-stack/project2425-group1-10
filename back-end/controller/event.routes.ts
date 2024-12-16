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

eventRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userEmail = req.params.email;
        const tickets = await ticketService.getTicketsByUserEmail(userEmail);        
        res.status(200).json(tickets);
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
eventRouter.get('/details/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    try {
        const event = await eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ message: `Event with id ${id} does not exist.` });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Could not fetch event.' });
    }
});

/**
 * @swagger
 * /events/{id}/{email}:
 *   put:
 *     summary: Add a participant to an event.
 *     tags:
 *       - Events
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participant added successfully.
 *       400:
 *         description: Error adding participant.
 */

// eventRouter.put('/:id/:email', async (req: Request, res: Response, next: NextFunction) => {
//     const eventId = parseInt(req.params.id, 10);
//     const email = req.params.email;

//     try {
//         const updatedEvent = await eventService.addParticipantToEvent(email, eventId);
//         res.status(200).json(updatedEvent);
//     } catch (error) {
//         console.log(error);
//         if (error instanceof Error) {
//             res.status(400).json({ status: 'error', message: error.message });
//         } else {
//             res.status(400).json({ status: 'error', message: 'Unknown error' });
//         }
//     }
// });



// eventRouter.put('/remove/:id/:email', async (req: Request, res: Response, next: NextFunction) => {
//     const eventId = parseInt(req.params.id, 10);
//     const email = req.params.email;

//     try {
//         await eventService.removeEvent(email, eventId);
//         res.status(200).json({ message: 'Event removed successfully.' });
//     } catch (error){
//         console.log(error);
//     }

// })

export { eventRouter };
