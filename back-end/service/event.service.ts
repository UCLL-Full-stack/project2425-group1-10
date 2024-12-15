import { Event } from "../model/event";
import database from "../repository/database";
import eventDb from "../repository/event.db";
import { EventInput } from "../types";
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


const removeEvent = async (email: string, eventId: number) => {
    return await eventDb.removeFromMyEvents(email, eventId);
};

//create event:
const createEvent = async (eventData: EventInput): Promise<Event> => {
    const { name, description, date, location, category, backgroundImage, isTrending, users } = eventData;

    // Validate essential event fields
    if (!name) throw new Error('Event name is required');
    if (!description) throw new Error('Event description is required');
    if (!date) throw new Error('Event date is required');
    if (!location) throw new Error('Event location is required');
    if (!category) throw new Error('Event category is required');
    if (isTrending === undefined) throw new Error('Event trending status is required');

    // Create the event
    const eventPrisma = await database.event.create({
        data: {
            name,
            description,
            date,
            location,
            category,
            backgroundImage: backgroundImage || undefined,
            isTrending,
        },
        include: {
            users: true, // Include associated users in the event data
        },
    });

    // Return the created event, mapped to the Event model
    return Event.from(eventPrisma);
};











export default {
    createEvent,
    getAllEvents,
    getEventById,
    addParticipantToEvent,
    // getEventsByParticipantEmail,
    getEventsByUserEmail,
    removeEvent,

};