import { User } from "../../model/user";
import { Event } from "../../model/event";
import { EventInput, Role } from "../../types";
import eventDb from "../../repository/event.db";
import userDb from "../../repository/user.db";
import eventService from "../../service/event.service";
import { add } from "date-fns";
import userService from "../../service/user.service";
import exp from "constants";
import ticketService from "../../service/ticket.service";
import ticketDb from "../../repository/ticket.db";


const user = new User({
    username: 'johndoe',
    name: 'john',
    email: 'john.doe@ucll.be',
    password: 'johnd123',
    age: 19,
    role: 'participant' as Role,
});

const event = new Event({
    name: 'Christmass party',
    description: 'Lets celebrate Christmass',
    date: new Date(),
    location: 'Brussels',
    category: 'Private event',
    backgroundImage: 'url',
    isTrending: true,
})

let createEventMock: jest.Mock;

// let mockEventDbCreateEvent: jest.Mock;
// let mockEventDbGetEventByNameAndDate: jest.Mock;

// let mockUserDbGetUserById: jest.Mock;

//A: accurate mocks:
let mockEventDbGetEventById: jest.Mock;
let mockEventDbGetAllEvents: jest.Mock;
let mockEventDbAddingParticipantToEvent: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockEventDbGetEventsByUserEmail: jest.Mock;

beforeEach(() => {
    // mockEventDbCreateEvent = jest.fn();
    // mockEventDbGetEventByNameAndDate = jest.fn();
    // mockUserDbGetUserById = jest.fn();

    mockEventDbGetAllEvents = jest.fn();
    mockEventDbAddingParticipantToEvent = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockEventDbGetEventById = jest.fn();

    createEventMock = jest.fn();

    mockEventDbGetEventsByUserEmail = jest.fn();

});

//A: This basically clears everything after each render
afterEach(() => {
    jest.clearAllMocks();
});



//A: Test for the getEventById:
//happy one
test('Given: a valid event ID, When: getEventById is called, Then: the correct event is returned', async () => {
    //Given:
    eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(event); //A: we are setting up a mock case for the getEventById method in the event db
    // userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);


    //When:
    //A: Here we basically call the getEventById service (method) with an ID in this example case it is one.
    const result = await eventService.getEventById(1);

    //Then:
    //A: Here we check if the getEventById was called 1 time with ID 1.
    expect(mockEventDbGetEventById).toHaveBeenCalledTimes(1);
    expect(mockEventDbGetEventById).toHaveBeenCalledWith(1);
    //A: Here we check if the result of the service call is the same to the object of the event.
    expect(result).toEqual(event);
});

test('Given: an invalid or missing ID, When: getEventById is called, Then: an error is thrown.', async () => {
    // Given:
    const invalidId = -1;
    mockEventDbGetEventById.mockResolvedValue(null); //A: geen event is gevonden.

    // When & Then: Calling the function should throw an error
    await expect(eventService.getEventById(invalidId)).rejects.toThrow('Invalid ID provided. ID must be a positive number.');
});


//A: Test for the getAllEvents:

//happy one
test('Given: a need to get all the events, When: getAllEvents is called, Then: all events are returned.', async () => {
    //Given:
    const events = [event];
    eventDb.getAllEvents = mockEventDbGetAllEvents.mockResolvedValue(events);
    //When:
    const result = await eventService.getAllEvents();

    //Then:
    expect(mockEventDbGetAllEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual(events);
});

//unhappy:
test('Given: no events in the database, When: getAllEvents is called, Then an error is thrown.', async () => {
    //Given:
    eventDb.getAllEvents = mockEventDbGetAllEvents.mockResolvedValue([]);

    //A: When and then in a combination for efficiency:
    await expect(eventService.getAllEvents()).rejects.toThrow('Must contain at least 1 event.');
    expect(mockEventDbGetAllEvents).toHaveBeenCalledTimes(1);
});


//A: getEventsByUserEmail tests:

//happy one
test('Given: a user email, When: getEventsByUserEmail is called, Then: events for the user are returned', async () => {
    // Given:
    const userEmail = 'john.doe@ucll.be';


    const eventWithTicket = {
        event: event,
    };
    const tickets = [eventWithTicket];

    ticketDb.getTicketsByUserEmail = mockEventDbGetEventsByUserEmail.mockResolvedValue(tickets);

    // When:
    const result = await eventService.getEventsByUserEmail(userEmail);

    // Then:
    expect(mockEventDbGetEventsByUserEmail).toHaveBeenCalledWith(userEmail);
    expect(result).toEqual([event]);
});

//unhappy one:
test('Given: an invalid email format, When: getEventsByUserEmail is called, Then: an error is thrown for invalid email format', async () => {
    // Given: An invalid email
    const invalidEmail = 'invalid-email-format';

    // When & Then: Expecting an error to be thrown due to invalid email format
    await expect(eventService.getEventsByUserEmail(invalidEmail)).rejects.toThrow('Invalid email format.');
});






//Create event

//A: create event unhappy:
test('Given: missing required fields, When: createEvent is called, Then: an error is thrown', async () => {
    // Given: Event without required fields (name is missing)
    const incompleteEvent = {
        description: 'Let’s celebrate Christmas',
        date: new Date(),
        location: 'Brussels',
        category: 'Private',
        backgroundImage: 'url',
        isTrending: true,
    };

    // Cast to EventInput, intentionally missing name
    const incompleteEventInput = incompleteEvent as EventInput;

    // When & Then: Expecting an error because name is required
    await expect(eventService.createEvent(incompleteEventInput)).rejects.toThrow('Missing required fields');
});


//A: create event unhappy one:
test('Given: an event with the same name and date, When: createEvent is called again, Then: an error is thrown for duplicate events', async () => {
    // Given:
    const existingEvent = {
        name: 'Christmas Party',
        description: 'Let’s celebrate Christmas',
        date: new Date(),
        location: 'Brussels',
        category: 'Private',
        backgroundImage: 'url',
        isTrending: true,
    };

    // Mocking the database to simulate the event already exists
    mockEventDbGetEventById.mockResolvedValue(existingEvent);  //A: this event already exists.
    eventDb.createEvent = createEventMock;

    // Simulating service logic to check for duplicate events
    createEventMock.mockRejectedValue(new Error('Event already exists, no duplicate events allowed.'));

    // When & Then:
    await expect(eventService.createEvent(existingEvent)).rejects.toThrow('Event already exists, no duplicate events allowed.');
});

//A: Test for the createEvent: => defintly recheck for error logic
//happy one
test('Given: a valid event, when event is created, then event is created with those values', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const input = {
        name: event.getName(),
        description: event.getDescription(),
        date: futureDate,
        location: event.getLocation(),
        category: event.getCategory(),
        backgroundImage: event.getBackgroundImage(),
        isTrending: event.getIsTrending(),
    };

    createEventMock.mockResolvedValue(input);
    eventDb.createEvent = createEventMock;

    const result = await eventService.createEvent(input);

    expect(createEventMock).toHaveBeenCalledTimes(1);
    expect(createEventMock).toHaveBeenCalledWith(expect.objectContaining(input));
    expect(result).toEqual(input);  //A: here we expect the result to match the input
})





// test('Given: a valid participant email and event ID, When: the addParticipantToEvent is called, Then: the participant is added to the event', async () => {
//     //Given:
//     //A: Here we add a participant to the event in the event db.
//     eventDb.addParticipantToEvent = mockEventDbAddingParticipantToEvent.mockResolvedValue(event);
//     userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);

//     //When:
//     //A: Here we call the service method to add a participant to the event with a specific email and event ID.
//     const result = await eventService.addParticipantToEvent('amelie.lammens@ucll.be', 1);

//     //Then:
//     expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledTimes(1);
//     expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledWith('amelie.lammens@ucll.be', 1);
//     expect(result).toEqual(event);
// })



// test('Given: a user who is already a participant to that event, When: addParticipantToEvent is called, Then: an error is thrown', async () => {
//     // Given:
//     //A: Here we add an error message that will be shown when the participant is already part of the event.
//     const errorMessage = 'User [amelie.lammens@ucll.be] already exists in this event.';
//     //A: Mocking the 'addParticipantToEvent' method to reject with the error message.
//     mockEventDbAddingParticipantToEvent.mockRejectedValue(new Error(errorMessage));


//     eventDb.addParticipantToEvent = mockEventDbAddingParticipantToEvent;

//     // When: Add the participant to the event

//     //Here we call the addParticipantToEvent method while knowing it will throw an error.
//     const addParticipant = async () => await eventService.addParticipantToEvent('amelie.lammens@ucll.be', 1);

//     // Then:

//     //A: Here we check that the service call will throw the correct error.
//     await expect(addParticipant()).rejects.toThrow(errorMessage);
//     //A: Verifying that the database method was called once.
//     expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledTimes(1);
//     //A: Verifying that the method was called with the correct email and event ID.
//     expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledWith('amelie.lammens@ucll.be', 1);
// });




// test('Given: a participant email and event ID, When: removeEvent is called, Then: the participant is removed from the event', async () => {
//     // Given:
//     const email = 'john.doe@ucll.be';
//     const eventId = 1;
//     eventDb.removeFromMyEvents = jest.fn().mockResolvedValue(undefined);

//     // When:
//     const result = await eventService.removeEvent(email, eventId);

//     // Then:
//     expect(eventDb.removeFromMyEvents).toHaveBeenCalledWith(email, eventId);
//     expect(result).toBeUndefined();
// });

