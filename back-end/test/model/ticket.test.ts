import { create } from "domain";
import { Ticket } from "../../model/ticket";
import exp from "constants";

const type= 'Regular';
const cost = 100;

test('Given: valid values for ticket, When: ticket is created, Then: ticket is created with those values', () => {
    //Given:
    const ticket = new Ticket({type, cost});
    //When:
    const createdTicket = ticket
    //Then:
    expect(createdTicket.getType()).toEqual(type);
    expect(createdTicket.getCost()).toEqual(cost);
});

test('Given: invalid type, When: ticket is created, Then: error is thrown', () => {
    //Given:
    const invalidType = "vip is boring";
    const cost = 100;

    //When:
    const createdTicket = () => new Ticket({type: invalidType as 'VIP' | 'Regular', cost});

    //Then:
    expect(createdTicket).toThrow('Invalid ticket type.')
})

test('Given: cost is invalid, When: ticket is created, Then: error is throw', () => {
    //Given:
    const type= 'Regular';
    const wrongCost = -100;
    
    //When:
    const createdTicket = () => new Ticket({type, cost: wrongCost });

    //Then:
    expect(createdTicket).toThrow('Cost must be a positive number.')
})