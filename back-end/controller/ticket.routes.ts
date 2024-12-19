/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *         cost:
 *           type: number
 *         event:
 *           $ref: '#/components/schemas/Event'
 *         user:
 *           $ref: '#/components/schemas/User'
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: Event ID
 *         name:
 *           type: string
 *           description: Event name
 *         description:
 *           type: string
 *           description: Event description
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the event
 *         location:
 *           type: string
 *           description: Event location
 *         category:
 *           type: string
 *           description: Event category
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         age:
 *           type: integer
 *         role:
 *           $ref: '#/components/schemas/Role'
 *     Role:
 *       type: string
 *       enum:
 *         - ADMIN
 *         - PARTICIPANT
 *         - ORGANIZER
 */
import express, { NextFunction, Request, Response } from 'express';
import ticketService from '../service/ticket.service';
import { UserInput } from '../types';

const ticketRouter = express.Router();

/**
 * @swagger
 * /tickets:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all tickets.
 *     description: Returns JSON array of tickets, each item in the array is of type Ticket.
 *     tags:
 *       - Tickets
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while fetching the list of tickets.
 */
ticketRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /tickets/{email}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all tickets by user email.
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while fetching the list of tickets.
 */
ticketRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const tickets = await ticketService.getTicketsByUserEmail(email);
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /tickets/event/{eventId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all tickets by event id.
 *     description: Returns JSON array of tickets, each item in the array is of type Ticket.
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while fetching the list of tickets.
 */
ticketRouter.get('/event/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = parseInt(req.params.eventId, 10);
        const tickets = await ticketService.getTicketsByEventId(eventId);
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /tickets/purchase/{ticketId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Purchase a ticket.
 *     description: Returns JSON object of ticket, the item is of type Ticket.
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while purchasing the ticket.
 */
ticketRouter.put('/purchase/:ticketId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ticketId = parseInt(req.params.ticketId, 10);
        const email = req.body.user;
        const ticket = await ticketService.userBuyTicket(ticketId, email);
        res.status(200).json(ticket);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

/**
 * @swagger
 * /tickets/{ticketId}/user:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove user from ticket.
 *     description: Returns JSON object of ticket, the item is of type Ticket.
 *     tags:
 *       - Tickets
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while removing user from ticket.
 */
ticketRouter.put('/:ticketId/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await ticketService.removeUserFromTicket(req.params.ticketId);
        res.status(200).json(response);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
})

/**
 * @swagger
 * /tickets/create:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a ticket.
 *     description: Returns JSON object of ticket, the item is of type Ticket.
 *     tags:
 *       - Tickets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               cost:
 *                 type: number
 *               event:
 *                 type: string
 *     responses:
 *       200:
 *         description: A ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Error occurred while creating the ticket.
 */
ticketRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, cost, event } = req.body;
        const ticket = await ticketService.createTicket(type, cost, event);
        res.status(200).json(ticket);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

export { ticketRouter };