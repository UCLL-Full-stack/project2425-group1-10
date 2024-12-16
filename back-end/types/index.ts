type Role = 'ADMIN' | 'PARTICIPANT' | 'ORGANIZER';
type TicketType = 'VIP' | 'REGULAR' | 'STUDENT' | 'FREE';

type UserInput = {
    id?: number,
    username: string,
    name: string,
    email: string,
    password: string,
    age: number,
    role: Role,
};

type EventInput = {
    id?: number,
    name: string,
    description: string,
    date: Date;
    location: string,
    category: string,
    backgroundImage?: string,
    isTrending: boolean,
};

type InviteInput = {
    id?: number,
    status: 'pending' | 'confirmed' | 'declined',
    email: string,
};

type TicketInput = {
    id?: number,
    type: TicketType,
    cost: number,
    user?: UserInput,
    event: EventInput,
};

type AuthenticationResponse = {
    token: string;
    email: string;
    username: string;
    name: string;
    role: Role;
};

export {
    Role,
    TicketType,
    EventInput,
    UserInput,
    InviteInput,
    TicketInput,
    AuthenticationResponse,
};