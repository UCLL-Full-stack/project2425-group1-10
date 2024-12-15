import { Event } from "../model/event";
import prisma from '../repository/database';
import { EventInput } from "../types";
import database from './database';

const getAllEvents = async (): Promise<Event[]> => {
    const eventsPrisma = await database.event.findMany({
        include: {
            users: true,
        },
    });
    return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma));
}

const getEventById = async (id: number): Promise<Event> => {
    const eventPrisma = await database.event.findUnique({
        where: {
            id: id,
        },
        include: {
            users: true,
        },
    });

    if (!eventPrisma) {
        throw new Error('Event not found.');
    }
    return Event.from(eventPrisma);
};

const addParticipantToEvent = async (email: string, eventId: number): Promise<Event> => {

    const userExisted = await userExist(email, eventId);
    if (userExisted) {
        throw new Error(`User [${email}] already exists in this event.`);
    };

    const user = await database.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        throw new Error(`User [${email}] not found.`);
    }

    const update = await database.event.update({
        where: {
            id: eventId,
        },
        data: {
            users: {
                connect: {
                    id: user.id,
                },
            },
        },
        include: {
            users: true,
        },
    });

    return Event.from(update);
};

const userExist = async (email: string, eventId: number): Promise<boolean> => {
    const event = await getEventById(eventId);

    for (const user of event.getUsers()) {
        if (user.getEmail() === email) {
            return true;
        }
    }

    return false;
};

const getEventsByUserEmail = async (email: string): Promise<Event[]> => {
    const events = await database.event.findMany({
        where: {
            users: {
                some: {
                    email: email,
                },
            },
        },
        include: {
            users: true,
        },
    });
    return events.map((event) => Event.from(event));
};


// remove events
const removeFromMyEvents = async (email: string, eventId: number) => {
    await database.event.update({
        where: {
            id: eventId, //event op basis van id
        },
        data: {
            users: {
                disconnect: {
                    email: email,
                },
            },
        },
    });

    // return { success: true, message: `Event ${eventId} successfully deleted ${email}.` };
};

//Create event:
const createEvent = async (eventData: EventInput): Promise<Event> => {
    try {
        const eventPrisma = await database.event.create({
            data: {
                name: eventData.name,
                description: eventData.description,
                date: eventData.date,
                location: eventData.location,
                category: eventData.category,
                backgroundImage: eventData.backgroundImage || undefined, // Optional field
                isTrending: eventData.isTrending,
            },
            include: {
                users: true, //A: Not sure about this part =>  saw in the lab06.
            },
        });

        return Event.from(eventPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};



export default {
    createEvent,
    getAllEvents,
    getEventById,
    // addParticipantToEvent,
    addParticipantToEvent,
    getEventsByUserEmail,
    userExist,
    removeFromMyEvents
};