import { get } from 'http';
import { Ticket } from '../model/ticket';
import ticketDb from '../repository/ticket.db';
import { EventInput, UserInput } from '../types';

const getAllTickets = async (): Promise<Ticket[]> => {
    const ticket = await ticketDb.getAllTickets();

    if (ticket.length === 0) {
        throw new Error('Must contain at least 1 ticket.')
    }
    return ticket;
};

const getTicketsByEventId = async (eventId: number): Promise<Ticket[]> => {
    if (!eventId || typeof eventId !== 'number' || eventId <= 0) {
        throw new Error('EventId must be a positive number and cannot be empty.');
    }
    const tickets = await ticketDb.getTicketsByEventId(eventId)
    return tickets;
};

const getTicketsByUserEmail = async (email: string): Promise<Ticket[]> => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error('Invalid email format.');
    }
    const tickets = await ticketDb.getTicketsByUserEmail(email);
    return tickets;
    // return await ticketDb.getTicketsByUserEmail(email);
};

const userBuyTicket = async (ticketId: number, email: string) => {
    if (!ticketId || typeof ticketId !== 'number' || ticketId <= 0) {
        throw new Error('Ticket ID must be a positive number.');
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Email must be a valid non-empty string.');
    }
    return await ticketDb.userBuyTicket(ticketId, email);
};

const removeUserFromTicket = async (ticketId: string) => {
    if (!ticketId || typeof ticketId !== 'string' || ticketId.trim() === '') {
        throw new Error('Invalid ticket ID');
    }
    return await ticketDb.removeUserFromTicket(ticketId);
}

const createTicket = async (type: string, cost: number, event: EventInput) => {
    return await ticketDb.createTicket(type, cost, event);
}

export default {
    getAllTickets,
    getTicketsByEventId,
    userBuyTicket,
    getTicketsByUserEmail,
    removeUserFromTicket,
    createTicket,
};