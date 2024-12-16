import { TicketType } from "../types";
import { User } from './user';
import { Event } from './event';
import {
    User as UserPrisma,
    Event as EventPrisma,
    Ticket as TicketPrisma,
} from '@prisma/client';

export class Ticket {
    private id?: number;
    private type: TicketType;
    private cost: number;
    private user: User | null;
    readonly event: Event;

    constructor(ticket: {
        id?: number,
        type: TicketType,
        cost: number;
        user: User | null;
        event: Event;
    }) {
        this.id = ticket.id;
        this.type = ticket.type;
        this.cost = ticket.cost;
        this.user = ticket.user;
        this.event = ticket.event;
    }

    getId(): number | undefined {
        return this.id;
    }

    getType(): TicketType {
        return this.type;
    }

    getCost(): number {
        return this.cost;
    }
    getUser(): User | null {
        return this.user ?? null;
    }

    getEvent(): Event {
        return this.event;
    }

    equals(ticket: Ticket): boolean {
        return (
            this.type === ticket.getType() &&
            this.cost === ticket.getCost()
        );
    }

    static from({
        id,
        type,
        cost,
        user,
        event,
    }: TicketPrisma & {
        // user: UserPrisma;
        user?: UserPrisma | null;
        event: EventPrisma
    }) {
        return new Ticket({
            id,
            type: type as TicketType,
            cost,
            // user: User.from(user),
            user: user ? User.from(user) : null,
            event: Event.from(event),
        });
    }
}
