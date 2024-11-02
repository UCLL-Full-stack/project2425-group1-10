import { Event } from "../model/event";
import eventDb from "../repository/event.db";
import { EventInput } from "../types";
import participantService from "./participant.service";
//added 31/10
const createEvent = (eventInput: EventInput): Event => {
    if (!eventInput.name) throw new Error('Event name is required');
    if (!eventInput.description) throw new Error('Event description is required');
    if (!eventInput.date) throw new Error('Event date is required');
    if (!eventInput.location) throw new Error('Event location is required');
    if (!eventInput.category) throw new Error('Event category is required');

    // Validate the date
    if (isNaN(eventInput.date.getTime())) {
        throw new Error('Invalid event date');
    }

    const existingEvent = eventDb.getAllEvents().find(event => event.getName() === eventInput.name && event.getDate().getTime() === eventInput.date.getTime());

    if (existingEvent) {
        throw new Error('The event already exists.');
    }

    const event = new Event(eventInput);
    return eventDb.createEvent(event);
};

//Function to get all the events
const getAllEvents = (): Event[] => {
    return eventDb.getAllEvents();
};

//To get the events by their id:
const getEventById = (id: number): Event => {
    const event = eventDb.getEventById({ id });
    if (!event){
        throw new Error(`Event with id ${id} does not exist.`)
    }
    return event;
};

const addParticipantToEvent = (email: string, eventId: number): void => {
    const participant = participantService.getParticipantByEmail(email);
    eventDb.addParticipantToEvent(participant, eventId);
};

export default {
    createEvent,
    getAllEvents,
    getEventById,
    addParticipantToEvent,
};