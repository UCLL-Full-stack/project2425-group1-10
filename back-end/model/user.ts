import { Role } from "../types";

import {
    // Role as RolePrisma,
    User as UserPrisma,
} from '@prisma/client';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly age: number;
    readonly role: Role;

    constructor(user: {
        id?: number,
        username: string,
        name: string,
        email: string,
        password: string,
        age: number,
        role: Role,
    }) {
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
    }: UserPrisma) {
        return new User({
            id,
            username,
            name,
            email,
            password,
            age,
            role: role as Role,
        });
    };
}