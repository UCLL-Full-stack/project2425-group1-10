import { Event } from "../model/event";
import eventDb from "../repository/event.db";
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

const addParticipantToEvent = async (email: string, eventId: number): Promise<Event> => {
    return await eventDb.addParticipantToEvent(email, eventId);
};

const getEventsByUserEmail = async (email: string): Promise<Event[]> => {
    return await eventDb.getEventsByUserEmail(email);
};

export default {
    // createEvent,
    getAllEvents,
    getEventById,
    addParticipantToEvent,
    // getEventsByParticipantEmail,
    getEventsByUserEmail
};