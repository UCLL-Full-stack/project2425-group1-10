import { Event } from "../model/event";
import { Participant } from "../model/participant";
import { User } from "../model/user";

//Create event:
const createEvent = (event: Event): Event =>{
    events.push(event);
    return event;
}

const userJohn = new User({
    id: 1,
    username: 'john_doe',
    name: 'John Doe',
    email: 'john.doe@ucll.be',
    password: 'passwordJohn',
    age: 26,
    role: 'participant',
});

const userJane = new User({
    id: 2,
    username: 'jane_doe',
    name: 'Jane Doe',
    email: 'jane.doe@ucll.be',
    password: 'passwordJane',
    age: 30,
    role: 'participant',
});

const userAlice = new User({
    id: 3,
    username: 'alice_smith',
    name: 'Alice Smith',
    email: 'alice.smith@ucll.be',
    password: 'passwordAlice',
    age: 24,
    role: 'participant',
});

const userBob = new User({
    id: 4,
    username: 'bob_brown',
    name: 'Bob Brown',
    email: 'bob.brown@ucll.be',
    password: 'passwordBob',
    age: 29,
    role: 'participant',
});

const userCharlie = new User({
    id: 5,
    username: 'charlie_miller',
    name: 'Charlie Miller',
    email: 'charlie.miller@ucll.be',
    password: 'passwordCharlie',
    age: 22,
    role: 'participant',
});

const userDiana = new User({
    id: 6,
    username: 'diana_jones',
    name: 'Diana Jones',
    email: 'diana.jones@ucll.be',
    password: 'passwordDiana',
    age: 27,
    role: 'participant',
});

const userEve = new User({
    id: 7,
    username: 'eve_white',
    name: 'Eve White',
    email: 'eve.white@ucll.be',
    password: 'passwordEve',
    age: 25,
    role: 'participant',
});


const participants_taylor_swift_concert = [
    new Participant({
        id: 1,
        user: userJohn,
    }),
    new Participant({
        id: 2,
        user: userJane,
    }),
];

const participants_chris_birthday_party = [
    new Participant({
        id: 3,
        user: userAlice,
    }),
];

const participants_company_networking_night = [
    new Participant({
        id: 4,
        user: userBob,
    }),
    new Participant({
        id: 5,
        user: userCharlie,
    }),
    new Participant({
        id: 6,
        user: userDiana,
    }),
    new Participant({
        id: 7,
        user: userEve,
    }),
];

const events = [
    new Event({
        id: 1,
        name: 'Taylor Swift Concert',
        description: 'Amazing music, sang by a talented artist.',
        date: new Date('2024-12-12'), //!!!
        location: 'Amsterdam',
        category: 'Concert',
        backgroundImage: '/images/taylor-swift-concert.jpg',
        participants: participants_taylor_swift_concert,
    }),
    new Event({
        id: 2,
        name: 'Chris Birthday Party',
        description: 'It is Chris Birthday!',
        date: new Date('2025-6-15'),
        location: 'Brussel',
        category: 'Birthday Celebration',
        backgroundImage: '/images/chris-birthday-party.jpg',
        participants: participants_chris_birthday_party,
    }),
    new Event({
        id: 3,
        name: 'Food Festival',
        description: 'A festival with a variety of delicious foods from all around the world.',
        date: new Date('2024-11-20'),
        location: 'Paris',
        category: 'Culinary Festival',
        backgroundImage: '/images/food-festival.jpg',
        participants: [],
    }),
    new Event({
        id: 4,
        name: 'Company Networking Night',
        description: 'An evening to connect and network with industry professionals.',
        date: new Date('2024-12-05'),
        location: 'Berlin',
        category: 'Company Networking Exchange',
        backgroundImage: '/images/company-networking-night.jpg',
        participants: participants_company_networking_night,
    }),
    new Event({
        id: 5,
        name: 'Art Exhibition: Modern Wonders',
        description: 'A showcase of contemporary art from emerging artists.',
        date: new Date('2025-02-18'),
        location: 'London',
        category: 'Art Exhibition',
        backgroundImage: '/images/art-exhibition.jpg',
        participants: [],
    }),
    new Event({
        id: 6,
        name: 'Yoga Workshop: elevate your mind',
        description: 'A relaxing yoga session for all skill levels, focusing on mindfulness and flexibility.',
        date: new Date('2025-03-10'),
        location: 'Barcelona',
        category: 'Mindfulness',
        backgroundImage: '/images/yoga-workshop.jpg',
        participants: [],
    }),
    new Event({
        id: 7,
        name: 'Startup Pitch Competition',
        description: 'Innovative startups compete to win funding and recognition.',
        date: new Date('2025-04-22'),
        location: 'Dublin',
        category: 'Entrepreneurship',
        backgroundImage: '/images/startup-pitch-competition.jpg',
        participants: [],
    }),

    new Event({
        id: 8,
        name: 'Clean Code: The Next Level',
        description: 'A conference featuring the latest advancements in technology and innovation.',
        date: new Date('2025-05-10'),
        location: 'San Francisco',
        category: 'Tech Conference',
        backgroundImage: '/images/tech-conference.jpg',
        participants: [],
    }),
    new Event({
        id: 9,
        name: 'Wine Tasting Evening',
        description: 'An elegant evening of fine wines and gourmet pairings.',
        date: new Date('2025-07-08'),
        location: 'Rome',
        category: 'Sommelier Events',
        backgroundImage: '/images/wine-tasting-evening.jpg',
        participants: [],
    }),
];

const getAllEvents = (): Event[] => {
    return events;
}

const getEventById = ({ id }: { id: number }): Event | null => {
    try {
        return events.find((event) => event.getId() === id) || null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for the details.')
    }
};

const addParticipantToEvent = (participant: Participant, eventId: number): void => {
    events.forEach(event => {
        if (event.getId() === eventId) {
            event.addParticipant(participant);
        };
    });
};

export default {
    createEvent,
    getAllEvents,
    getEventById,
    addParticipantToEvent,
};