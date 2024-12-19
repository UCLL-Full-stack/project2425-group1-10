import { Role } from "../types";
import { Event } from "./event";

import {
    // Role as RolePrisma,
    User as UserPrisma,
    Event as EventPrisma
} from '@prisma/client';

export class User {
    private id?: number;
    private username: string;
    private name: string;
    private email: string;
    private password: string;
    private age: number;
    private role: Role;
    private events: Event[] = [];

    constructor(user: {
        id?: number,
        username: string,
        name: string,
        email: string,
        password: string,
        age: number,
        role: Role,
        events: Event[],
    }) {
        if (!user.username) {
            throw new Error('Username cannot be empty.');
        }

        if (!user.name) {
            throw new Error('Name cannot be empty.');
        }

        if (!user.email) {
            throw new Error('Email cannot be empty.');
        }

        if (user.email && !user.email.includes('@') && !user.email.includes('.')) {
            throw new Error('Email is invalid.');
        }

        if (!user.password) {
            throw new Error('Password cannot be empty.');
        }

        if (user.password.length < 8) {
            throw new Error('Password must be at least 8 characters.');
        }

        if (!user.age) {
            throw new Error('Age cannot be empty.');
        }

        if (!user.role) {
            throw new Error('Role cannot be empty.');
        }

        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.age = user.age;
        this.role = user.role;
        this.events = user.events;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getAge(): number {
        return this.age;
    }

    getRole(): Role {
        return this.role;
    }

    getFavoriteEvents(): Event[] {
        return this.events;
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.name === user.getName() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.age === user.getAge() &&
            this.role === user.getRole() 
        );
    }

    static from({
        id,
        username,
        name,
        email,
        password,
        age,
        role,
        events
    }: UserPrisma & {events: EventPrisma[]}) {
        return new User({
            id,
            username,
            name,
            email,
            password,
            age,
            role: role as Role,
            events: events.map(event => Event.from(event)),
        });
    };
}