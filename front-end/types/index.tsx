export type Role = 'ADMIN' | 'PARTICIPANT' | 'ORGANIZER';
export type TicketType = 'VIP' | 'REGULAR' | 'STUDENT' | 'FREE';
export type InviteStatus = 'PENDING' | 'ACCEPT' | 'DECLINE';

export type UserInput = {
    id?: number,
    username?: string,
    name?: string,
    email?: string,
    password?: string,
    age?: number,
    role?: Role,
};

export type EventInput = {
    id?: number,
    name: string,
    description: string,
    date: Date;
    location: string,
    category: string,
    backgroundImage?: string,
    isTrending: boolean,
};

export type InviteInput = {
    id?: number,
    status: InviteStatus,
    user: UserInput,
    event: EventInput,
};

export type TicketInput = {
    id?: number,
    type: TicketType,
    cost: number,
    user: UserInput,
    event: EventInput,
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};