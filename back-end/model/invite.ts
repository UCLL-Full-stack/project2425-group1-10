import { InviteStatus, UserInput } from "../types";
import {
    User as UserPrisma,
    Event as EventPrisma,
    Invite as InvitePrisma,
} from '@prisma/client';
import { User } from "./user";
import { Event } from './event';


export class Invite {
    private id?: number;
    private status: InviteStatus;
    private users: User[];
    private event: Event;

    constructor(invite: {
        id?: number;
        status: InviteStatus;
        users: User[];
        event: Event;
    }) {
        this.id = invite.id;
        this.status = invite.status;
        this.users = invite.users;
        this.event = invite.event;
    }


    getId(): number | undefined {
        return this.id;
    }

    getStatus(): InviteStatus {
        return this.status;
    }

    getUsers(): User[] {
        return this.users;
    }

    getEvent(): Event {
        return this.event;
    }

    equals(invite: Invite): boolean {
        return (
            this.status === invite.getStatus() &&
            this.users === invite.getUsers() 
        )
    }

    static from({
        id,
        status,
        users,
        event,
    }: InvitePrisma & {
        users: UserPrisma[],
        event: EventPrisma,
    }) {
        return new Invite({
            id,
            status: status as InviteStatus,
            users: users.map((user) => User.from(user)),
            event: Event.from(event),
        });
    }
}
