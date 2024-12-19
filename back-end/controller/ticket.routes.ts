import express, { NextFunction, Request, Response } from 'express';
import ticketService from '../service/ticket.service';

const ticketRouter = express.Router();

ticketRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
});

ticketRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        const tickets = await ticketService.getTicketsByUserEmail(email);
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
});

ticketRouter.get('/event/:eventId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventId = parseInt(req.params.eventId, 10);
        const tickets = await ticketService.getTicketsByEventId(eventId);
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
});

ticketRouter.put('/purchase/:ticketId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ticketId = parseInt(req.params.ticketId, 10);
        const email = req.body.user;
        const ticket = await ticketService.userBuyTicket(ticketId, email);
        res.status(200).json(ticket);
    } catch (error) {
        next(error);
    }
});

ticketRouter.put('/:ticketId/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await ticketService.removeUserFromTicket(req.params.ticketId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

ticketRouter.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, cost, event } = req.body;
        const ticket = await ticketService.createTicket(type, cost, event);
        res.status(200).json(ticket);
    } catch (error) {
        next(error);
    }
});

export { ticketRouter };