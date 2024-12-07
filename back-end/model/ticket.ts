export class Ticket {
    private id?: number;
    private type: 'VIP' | 'Regular';
    private cost: number;

    constructor(ticket: {
        id?: number,
        type: 'VIP' | 'Regular',
        cost: number;
    }) {
        // Validate the type
        if (ticket.type !== 'VIP' && ticket.type !== 'Regular') {
            throw new Error('Invalid ticket type.');
        }
        if(ticket.cost < 0){
            throw new Error('Cost must be a positive number.')
        }


        this.id = ticket.id;
        this.type = ticket.type;
        this.cost = ticket.cost;
    }

    getId(): number | undefined {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getCost(): number {
        return this.cost;
    }

    equals(ticket: Ticket): boolean {
        return (
            this.type === ticket.getType() &&
            this.cost === ticket.getCost()
        );
    }
}
