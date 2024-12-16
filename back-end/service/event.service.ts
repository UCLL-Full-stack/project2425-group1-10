import { Event } from "../model/event";
import database from "../repository/database";
import eventDb from "../repository/event.db";
import { EventInput } from "../types";
import ticketDb from "../repository/ticket.db";
import userService from "./user.service";


//Function to get all the events
const getAllEvents = async (): Promise<Event[]> => {
    return await eventDb.getAllEvents();
};

//To get the events by their id:
const getEventById = async (id: number): Promise<Event> => {
    const event = await eventDb.getEventById(id);
    if (!event) {
        throw new Error('Event not found.');
    }
    return event;
};

// const addParticipantToEvent = async (email: string, eventId: number): Promise<Event> => {
//     return await eventDb.addParticipantToEvent(email, eventId);
// };

const getEventsByUserEmail = async (email: string): Promise<Event[]> => {
    const tickets = await ticketDb.getTicketsByUserEmail(email);
    const events = tickets.map((ticket) => ticket.event);

    return events;
};


// const removeEvent = async (email: string, eventId: number) => {
//     return await eventDb.removeFromMyEvents(email, eventId);
// };

const createEvent = async (event: EventInput): Promise<Event> => {
    return await eventDb.createEvent(event);
}


export default {
    createEvent,
    getAllEvents,
    getEventById,
    // addParticipantToEvent,
    // getEventsByParticipantEmail,
    getEventsByUserEmail,
    // removeEvent,
    
};