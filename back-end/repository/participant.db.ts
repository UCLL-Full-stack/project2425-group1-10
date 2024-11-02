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

const participants = [
    new Participant({
        id: 1,
        user: userJohn,
    }),
    new Participant({
        id: 2,
        user: userJane,
    }),
];

const getAllParticipants = (): Participant[] => {
    return participants;
};

export default {
    getAllParticipants,
};