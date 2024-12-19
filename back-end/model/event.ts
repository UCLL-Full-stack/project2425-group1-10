import {
    Event as EventPrisma,
    User as UserPrisma,
    // Ticket as TicketPrisma,
    // User as UserPrisma,
} from '@prisma/client';
import { User } from './user';
import { Ticket } from './ticket';


export class Event {
    readonly id?: number;
    readonly name: string;
    readonly description: string;
    readonly date: Date;
    readonly location: string;
    readonly category: string;
    readonly backgroundImage?: string;
    readonly isTrending: boolean;

    constructor(event: {
        id?: number,
        name: string,
        description: string,
        date: Date,
        location: string,
        category: string;
        backgroundImage?: string;
        isTrending: boolean;
    }) {
        // Validate the date
        if (isNaN(event.date.getTime())) {
            throw new Error('Date is invalid.');
        }

        if (!event.name) {
            throw new Error('Name cannot be empty.');
        }
        if (!event.description) {
            throw new Error('Description cannot be empty.');
        }
        if (!event.location) {
            throw new Error('Location cannot be empty.');
        }
        if (!event.category) {
            throw new Error('Category cannot be empty.');
        }

        this.id = event.id;
        this.name = event.name;
        this.description = event.description;
        this.date = event.date;
        this.location = event.location;
        this.category = event.category;
        this.backgroundImage = event.backgroundImage;
        this.isTrending = event.isTrending;
        // this.tickets = event.tickets || [];
    }

    getIsTrending(): boolean {
        return this.isTrending;
    }


    getId(): number | undefined {
        if (this.id === undefined) {
            throw new Error('The event needs to have an ID.');
        }
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getDate(): Date {
        return this.date;
    }

    getLocation(): string {
        return this.location;
    }

    getCategory(): string {
        return this.category;
    }

    getBackgroundImage(): string | undefined {
        return this.backgroundImage;
    }

    equals(event: Event): boolean {
        return (
            this.name === event.getName() &&
            this.description === event.getDescription() &&
            this.date === event.getDate() &&
            this.location === event.getLocation() &&
            this.category === event.getCategory() &&
            this.backgroundImage === event.getBackgroundImage() &&
            this.isTrending === event.getIsTrending()
        );
    }

    static from({
        id,
        name,
        description,
        date,
        location,
        category,
        backgroundImage,
        isTrending,
        // users,
    }: EventPrisma
        // & {users: UserPrisma[]}
    ) {
        return new Event({
            id,
            name,
            description,
            date,
            location,
            category,
            backgroundImage,
            isTrending,
            // users: users.map(user => User.from(user))
        });
    };

}