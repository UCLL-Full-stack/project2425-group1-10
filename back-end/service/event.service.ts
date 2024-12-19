import { Event } from "../model/event";
import database from "../repository/database";
import eventDb from "../repository/event.db";
import { EventInput } from "../types";
import ticketDb from "../repository/ticket.db";
import userService from "./user.service";


//Function to get all the events
const getAllEvents = async (): Promise<Event[]> => {
    const event = await eventDb.getAllEvents();
    if (event.length === 0) {
        throw new Error('Must contain at least 1 event.')
    }
    return event;
};

//To get the events by their id:
const getEventById = async (id: number): Promise<Event> => {
    const event = await eventDb.getEventById(id);
    if (!event) {
        throw new Error('Event not found.');
    }

    if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('Invalid ID provided. ID must be a positive number.');
    }
    return event;
};

// const addParticipantToEvent = async (email: string, eventId: number): Promise<Event> => {
//     return await eventDb.addParticipantToEvent(email, eventId);
// };

const getEventsByUserEmail = async (email: string): Promise<Event[]> => {
    //A: validate:
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error('Invalid email format.');
    }

    const tickets = await ticketDb.getTicketsByUserEmail(email);
    const events = tickets.map((ticket) => ticket.event);

    return events;
};


const createEvent = async (eventData: Event): Promise<Event> => {
    if (!eventData.getName() || !eventData.getDescription() || !eventData.getDate() || !eventData.getLocation()) {
        throw new Error('Missing required fields.');
    }

    if (new Date(eventData.getDate()) < new Date()) {
        throw new Error('Event date cannot be in the past.');
    }
    return await eventDb.createEvent(eventData);
}


export default {
    createEvent,
    getAllEvents,
    getEventById,
    // addParticipantToEvent,
    // getEventsByParticipantEmail,
    getEventsByUserEmail,
    // removeEvent,
    // createEvent,
};