import { create } from "domain";
import { Ticket } from "../../model/ticket";
import exp from "constants";
import { Role, TicketType } from "../../types";
import { User } from "../../model/user";
import { Event } from '../../model/event';

const type: TicketType = 'REGULAR';

const cost = 100;

const testUser = new User({
    id: 1,
    username: 'bart123',
    name: 'Bart',
    email: 'bart@example.com',
    password: 'securePass123', // Valid password (>= 8 characters)
    age: 25,
    role: 'USER' as Role,
})

const testEvent = new Event({
    id: 1,
    name: 'Taylor Swift Concert',
    description: 'A concert by Taylor Swift',
    date: new Date('2024-12-25'),
    location: 'Los Angeles, CA',
    category: 'Music',
    isTrending: true,
});


test('Given: valid values for ticket, When: ticket is created, Then: ticket is created with those values', () => {
    //Given:
    const ticket = new Ticket({ type, cost, user:testUser, event: testEvent });
    //When:
    const createdTicket = ticket
    //Then:
    expect(createdTicket.getType()).toEqual(type);
    expect(createdTicket.getCost()).toEqual(cost);
});

test('Given: invalid type, When: ticket is created, Then: error is thrown', () => {
    //Given:
    const invalidType = "vip is boring"; // This is incorrect. Update this to match valid types, e.g. 'VIP'
    const cost = 100;

    //When:
    const createdTicket = () => new Ticket({ type: invalidType as 'VIP' | 'REGULAR', cost, user: testUser, event: testEvent });

    //Then:
    expect(createdTicket).toThrow('Invalid ticket type.');
});

test('Given: cost is invalid, When: ticket is created, Then: error is throw', () => {
    //Given:
    //const type = 'Regular';
    const wrongCost = -100;

    //When:
    const createdTicket = () => new Ticket({ type, cost: wrongCost, user: testUser,event: testEvent });

    //Then:
    expect(createdTicket).toThrow('Cost must be a positive number.')
})

test('Given: no user provided, when: ticket is created, then: error is thrown', () => {
    // Given:
    const cost = 100;

    // When:
    const createdTicket = () => new Ticket({ type, cost, user: null, event: testEvent });

    // Then:
    expect(createdTicket).toThrow('User must be provided.');
});

