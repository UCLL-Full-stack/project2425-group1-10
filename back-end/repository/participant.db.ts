import { Participant } from "../model/participant";
import { User } from "../model/user";

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

const participants = [
    new Participant({
        id: 1,
        user: userJohn,
    }),
    new Participant({
        id: 2,
        user: userJane,
    }),
    new Participant({
        id: 3,
        user: userAlice,
    }),
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

const getAllParticipants = (): Participant[] => {
    return participants;
};

const getParticipantByEmail = (email: string): Participant => {
    const participant = participants.find(participant => participant.getUser().getEmail() === email);
    if (!participant) {
        throw new Error(`Participant with email ${email} not found`);
    }
    return participant;
}

export default {
    getAllParticipants,
    getParticipantByEmail,
};