import { get } from 'http';
import {Ticket} from '../model/ticket';
import ticketDb from '../repository/ticket.db';

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

export default {
    getAllTickets,
    getTicketsByEventId,
    userBuyTicket,
    getTicketsByUserEmail,
    removeUserFromTicket,
};