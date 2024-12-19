import { get } from 'http';
import {Ticket} from '../model/ticket';
import ticketDb from '../repository/ticket.db';
import { EventInput, UserInput } from '../types';
import { Event } from '../model/event';

const getAllTickets = async (): Promise<Ticket[]> => {
    return await ticketDb.getAllTickets();
};

const getTicketsByEventId = async (eventId: number): Promise<Ticket[]> => {
    return await ticketDb.getTicketsByEventId(eventId);
};

const getTicketsByUserEmail = async (email: string): Promise<Ticket[]> => {
    return await ticketDb.getTicketsByUserEmail(email);
};

const userBuyTicket = async (ticketId: number, email: string) => {
    return await ticketDb.userBuyTicket(ticketId, email);
};

const removeUserFromTicket = async (ticketId: string) => {
    return await ticketDb.removeUserFromTicket(ticketId);
}

const createTicket = async (type: string, cost: number, event: Event) => {

    const eventData = new Event({
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category,
        backgroundImage: event.backgroundImage,
        isTrending: event.isTrending,
    })

    return await ticketDb.createTicket(type, cost, eventData);
}

export default {
    getAllTickets,
    getTicketsByEventId,
    userBuyTicket,
    getTicketsByUserEmail,
    removeUserFromTicket,
    createTicket,
};