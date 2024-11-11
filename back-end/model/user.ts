import { Role } from "../types";

import {
    Role as RolePrisma,
    User as UserPrisma,
} from '@prisma/client';

export class User {
    private id?: number;
    private username: string;
    private name: string;
    private email: string;
    private password: string;
    private age: number;
    private role: Role;

    constructor(user: {
        id?: number,
        username: string,
        name: string,
        email: string,
        password: string,
        age: number,
        role: Role,
    }) {
        if (!user.username) {
            throw new Error('Username can not be empty');
        }
        if (!user.name) {
            throw new Error('Name can not be empty.');
        }
        if (!user.password) {
            throw new Error('Password can not be empty.');
        }
        if (user.age <= 0 || !Number.isInteger(user.age)) {
            throw new Error('Age must be a positive integer.');
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!user.email || !emailRegex.test(user.email)) {
            throw new Error('Invalid email format.');
        }
        
        const validRoles: Role[] = ['participant', 'organizer'];
        if (!user.role || !validRoles.includes(user.role)) {
            throw new Error('Invalid role. Role must be either "participant" or "organizer".');
        }

        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.age = user.age;
        this.role = user.role;
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
    }: UserPrisma & { role: RolePrisma }) {
        return new User({
            id,
            username,
            name,
            email,
            password,
            age,
            role: role as Role,
        });
    }

}