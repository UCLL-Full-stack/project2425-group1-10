import { Ticket } from '../model/ticket';
import { User } from '../model/user';
import { Event } from '../model/event';
import { EventInput } from '../types';
// import prisma from '../repository/database';
import database from './database';

const getAllTickets = async (): Promise<Ticket[]> => {
    const ticketsPrisma = await database.ticket.findMany({
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });
    return ticketsPrisma.map((ticketPrisma) => Ticket.from(ticketPrisma));
};

const getTicketsByEventId = async (eventId: number): Promise<Ticket[]> => {
    const ticketsPrisma = await database.ticket.findMany({
        where: {
            event: {
                id: eventId,
            },
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });
    return ticketsPrisma.map((ticketPrisma) => Ticket.from(ticketPrisma));
};

const userBuyTicket = async (ticketId: number, email: string) => {
    const ticketPrisma = await database.ticket.update({
        where: {
            id: ticketId,
        },
        data: {
            user: {
                connect: {
                    email: email,
                },
            },
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return Ticket.from(ticketPrisma);
};

const getTicketsByUserEmail = async (email: string): Promise<Ticket[]> => {
    const ticketsPrisma = await database.ticket.findMany({
        where: {
            user: {
                email: email,
            }
        },
        include: {
            user: {include: {events: true}},
            event: true,
        }
    })

    return ticketsPrisma.map((ticketPrisma) => Ticket.from(ticketPrisma));
}

const removeUserFromTicket = async (ticketId: string) => {
    const id = parseInt(ticketId, 10);

    const ticketPrisma = await database.ticket.update({
        where: {
            id: id,
        },
        data: {
            user: {
                disconnect: true,
            },
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    })

    return Ticket.from(ticketPrisma);
}

const createTicket = async (type: string, cost: number, event: EventInput) => {
    const ticketPrisma = await database.ticket.create({
        data: {
            type: type,
            cost: cost,
            user: {},
            event: {
                connect: {
                    id: event.id,
                },
            },
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return Ticket.from(ticketPrisma);
};

export default {
    getAllTickets,
    getTicketsByEventId,
    userBuyTicket,
    getTicketsByUserEmail,
    removeUserFromTicket,
    createTicket,
}