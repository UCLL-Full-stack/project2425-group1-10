import { Ticket } from '../model/ticket';
// import prisma from '../repository/database';
import database from './database';

const getAllTickets = async (): Promise<Ticket[]> => {
    const ticketsPrisma = await database.ticket.findMany({
        include: {
            user: true,
            event: true,
        },
    });
    return ticketsPrisma.map((ticketPrisma) => Ticket.from(ticketPrisma));
};

const getTicketsByEventId = async (eventId: number): Promise<Ticket[]> => {
    const ticketsPrisma = await database.ticket.findMany({
        where: {
            eventId: eventId,
        },
        include: {
            user: true,
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
            user: true,
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
            user: true,
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
            user: true,
            event: true,
        },
    })

    return Ticket.from(ticketPrisma);
}

export default {
    getAllTickets,
    getTicketsByEventId,
    userBuyTicket,
    getTicketsByUserEmail,
    removeUserFromTicket,
}