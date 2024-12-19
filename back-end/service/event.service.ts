import { Event } from "../model/event";
import eventDb from "../repository/event.db";
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

    if (tickets.length === 0) {
        throw new Error('No events found.');
    }

    const events = tickets.map((ticket) => ticket.event);

    return events;
};

const createEvent = async (eventData: Event): Promise<Event> => {

    // If something is missing, errors will be thrown
    const event = new Event({
        name: eventData.name,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        category: eventData.category,
        backgroundImage: eventData.backgroundImage,
        isTrending: eventData.isTrending,
    });

    return await eventDb.createEvent(event);
}


export default {
    // createEvent,
    getAllEvents,
    getEventById,
    // addParticipantToEvent,
    // getEventsByParticipantEmail,
    getEventsByUserEmail,
    // removeEvent,
    createEvent,
};