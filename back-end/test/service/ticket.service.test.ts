import exp from "constants";
import { Ticket } from "../../model/ticket";
import { User } from "../../model/user";
import ticketDb from "../../repository/ticket.db";
import ticketService from "../../service/ticket.service";
import { Role } from "../../types";
import inviteService from "../../service/invite.service";


const user = new User({
    username: 'johndoe',
    name: 'john',
    email: 'john.doe@ucll.be',
    password: 'johnd123',
    age: 19,
    role: 'participant' as Role,
    events: []
});

const event = {
    id: 8,
    name: 'Sample Event',
    description: 'An example event',
    date: new Date(),
    location: 'New York',
    category: 'Private',
    backgroundImage: 'url',
    isTrending: true
};

const ticket = ({
    type: "VIP",
    cost: 150,
    user: user,
    event: event,
})

let createTicketMock: jest.Mock;
let mockTicketDbGetAllTickets: jest.Mock;
let mockTicketDbGetTicketsByEventId: jest.Mock;
let mockTicketDbGetTicketByUserEmail: jest.Mock;
let mockTicketDbUserBuyTicket: jest.Mock;
let mockTicketDbRemoveUserFromTicket: jest.Mock;

beforeEach(() => {
    createTicketMock = jest.fn();
    mockTicketDbGetAllTickets = jest.fn();
    mockTicketDbGetTicketsByEventId = jest.fn();
    mockTicketDbGetTicketByUserEmail = jest.fn();
    mockTicketDbUserBuyTicket = jest.fn();
    mockTicketDbRemoveUserFromTicket = jest.fn();

    ticketDb.getTicketsByEventId = mockTicketDbGetTicketsByEventId;

});

afterEach(() => {
    jest.clearAllMocks();
});

//GetAllTickets:

//happy
test('Given: a need to see all the tickets, When getAllTickets is called then all invites are returned', async () => {
    //Given:
    const tickets = [ticket]
    ticketDb.getAllTickets = mockTicketDbGetAllTickets.mockResolvedValue(tickets);

    //When:
    const result = await ticketService.getAllTickets();

    //then:
    expect(mockTicketDbGetAllTickets).toHaveBeenCalledTimes(1);
    expect(result).toEqual(tickets);
});

//unhappy
test('Given: no tickets, when: getAllTickets is called, then: an error is thrown', async () => {
    //Given:
    ticketDb.getAllTickets = mockTicketDbGetAllTickets.mockResolvedValue([]);

    //When + Then:
    await expect(ticketService.getAllTickets()).rejects.toThrow('Must contain at least 1 ticket.');
    expect(mockTicketDbGetAllTickets).toHaveBeenCalledTimes(1);

})


//GetallTicketsbyeventId
//A:needed to add an extra: ticketDb.getTicketsByEventId = mockTicketDbGetTicketsByEventId; in the mock so that this test worked.
//happy
test('Given: no tickets for the event, when: getTicketsByEventId is called, Then: it returns an empty array.', async () => {
    const mockEventId = 987;
    mockTicketDbGetTicketsByEventId.mockResolvedValue([]);

    const result = await ticketService.getTicketsByEventId(mockEventId);

    expect(mockTicketDbGetTicketsByEventId).toHaveBeenCalledWith(mockEventId);
    
    expect(result).toEqual([]);
})


//unhappy
test('Given: an empty string, when: getTicketsByEventId is called, then: an error is thrown', async () => {
    const invalidEventId = -500 //A: this is empty so invalid

    mockTicketDbGetTicketsByEventId.mockResolvedValue([])

    await expect(ticketService.getTicketsByEventId(invalidEventId)).rejects.toThrow('EventId must be a positive number and cannot be empty.')
})

test('Given: an invalid eventId, when: getTicketsByEventId is called, then: an error is thrown', async () => {
    const invalidEventId: string = 'thisIsWrong';

    mockTicketDbGetTicketsByEventId.mockResolvedValue([]);

    //When and Then:
    await expect(ticketService.getTicketsByEventId(invalidEventId as any)).rejects.toThrow('EventId must be a positive number and cannot be empty.')
})


//getTicketsByUserEmail

//happy
test('Given: a valid email, when: getTicketByUserEmail is called, then: the correct ticket is returned', async () => {
    //Given:
    ticketDb.getTicketsByUserEmail = mockTicketDbGetTicketByUserEmail.mockResolvedValue(ticket);

    //When:
    const result = await ticketService.getTicketsByUserEmail('ellie.doe@ucll.be');

    //Then:
    expect(mockTicketDbGetTicketByUserEmail).toHaveBeenCalledTimes(1);
    expect(mockTicketDbGetTicketByUserEmail).toHaveBeenCalledWith('ellie.doe@ucll.be');
    expect(result).toEqual(ticket);
})

//unhappy
test('Given: an invalid email format, When: getTicketsByUserEmail is called, then: an error is thrown', async () => {
    //Given:
    const invalidEmail = 'this_format_is_incorrect';

    //When + Then:
    await expect(ticketService.getTicketsByUserEmail(invalidEmail)).rejects.toThrow('Invalid email format.')
})


//removeUserFromTicket

//happy
test('Given: a valid ticket ID and email, when userBuyTicket is called, then it calls the database function and completes successfully', async () => {
    const validTicketId = 1;
    const validEmail = 'john.doe@ucll.be';

    const mockResponse = { success: true };
    const mockUserBuyTicket = jest.fn().mockResolvedValue(mockResponse);
    ticketDb.userBuyTicket = mockUserBuyTicket;

    const result = await ticketService.userBuyTicket(validTicketId, validEmail);

    expect(mockUserBuyTicket).toHaveBeenCalledWith(validTicketId, validEmail);
    expect(result).toEqual(mockResponse);
});



//unhappy
test('Given: an invalid ticket ID, when userBuyTicket is called, then an error is thrown', async () => {
    const invalidTicketId = -1;
    const validEmail = 'john.doe@ucll.be';

    await expect(ticketService.userBuyTicket(invalidTicketId, validEmail)).rejects.toThrow('Ticket ID must be a positive number.');
});

test('Given: an invalid email, when userBuyTicket is called, then an error is thrown', async () => {
    const validTicketId = 1;
    const invalidEmail = 'invalidformat'; //A: other option is to do it with empty string

    await expect(ticketService.userBuyTicket(validTicketId, invalidEmail)).rejects.toThrow('Email must be a valid non-empty string.');
});


//userBuyticket
//happy
test('Given: a valid ticket ID, when: removeUserFromTicket is called, then: the user is removed successfully', async () => {
    //Given:
    const validTicketId = 'valid-ticket-id';


    const mockResponse = { success: true };
    ticketDb.removeUserFromTicket = jest.fn().mockResolvedValue(mockResponse);

    // When:
    const result = await ticketService.removeUserFromTicket(validTicketId);

    // Then:
    expect(ticketDb.removeUserFromTicket).toHaveBeenCalledWith(validTicketId);
    expect(result).toEqual(mockResponse);
});

//unhappy
test('Given: an empty string, when: removeUserFromTicket is called, then: an error is thrown', async () => {
    const invalidTicketId = ''; // A: this is empty so invalid

    await expect(ticketService.removeUserFromTicket(invalidTicketId)).rejects.toThrow('Invalid ticket ID');
});

test('Given: an invalid ticket ID format, when: removeUserFromTicket is called, then: an error is thrown', async () => {
    const invalidTicketId = 12345; // A: ticketId should be a string

    await expect(ticketService.removeUserFromTicket(invalidTicketId as any)).rejects.toThrow('Invalid ticket ID');
});
