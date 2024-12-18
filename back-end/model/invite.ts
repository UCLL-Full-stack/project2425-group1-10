import { InviteStatus } from "../types";
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
    private user: User;
    private event: Event;

    constructor(invite: {
        id?: number;
        status: InviteStatus;
        user: User;
        event: Event;
    }) {

        if (!(invite.user instanceof User)) {
            throw new Error("Invalid user provided.");
        }

        if (!(invite.event instanceof Event)) {
            throw new Error("Invalid event provided.");
        }

        const validStatuses: InviteStatus[] = ['PENDING', 'CONFIRMED', 'DECLINED'];
        if (!validStatuses.includes(invite.status)) {
            throw new Error('Invalid status provided.');
        }

        this.id = invite.id;
        this.status = invite.status;
        this.user = invite.user;
        this.event = invite.event;
    }

    getId(): number | undefined {
        return this.id;
    }

    getStatus(): InviteStatus {
        return this.status;
    }

    getUser(): User {
        return this.user;
    }

    getEvent(): Event {
        return this.event;
    }

    equals(invite: Invite): boolean {
        return (
            this.status === invite.getStatus() &&
            this.user === invite.getUser()
        )
    }

    static from({
        id,
        status,
        user,
        event,
    }: InvitePrisma & {
        user: UserPrisma,
        event: EventPrisma,
    }) {
        return new Invite({
            id,
            status: status as InviteStatus,
            user: User.from(user),
            event: Event.from(event),
        });
    }
}
