export type Role = 'PARTICIPANT' | 'ORGANIZER';

export type UserInput = {
    id?: number,
    username: string,
    name: string,
    email: string,
    password: string,
    age: number,
    role: Role,
};

export type EventInput = {
    id?: number,
    name: string,
    description: string,
    date: Date;
    location: string,
    category: string,
    backgroundImage?: string,
    users: UserInput[],
    isTrending: boolean,
};

export type UserLogin = {
    email: string;
    password: string;
  };