import { User } from "../../model/user";
import { Event } from "../../model/event";
import { Role } from "../../types";
import eventDb from "../../repository/event.db";
import userDb from "../../repository/user.db";
import eventService from "../../service/event.service";
import { add } from "date-fns";

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
    users: [user],
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

beforeEach(() => {
    // mockEventDbCreateEvent = jest.fn();
    // mockEventDbGetEventByNameAndDate = jest.fn();
    // mockUserDbGetUserById = jest.fn();

    mockEventDbGetAllEvents = jest.fn();
    mockEventDbAddingParticipantToEvent = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockEventDbGetEventById = jest.fn();

    createEventMock = jest.fn();

});

//A: This basically clears everything after each render
afterEach(() => {
    jest.clearAllMocks();
});


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

test('Given: a valid participant email and event ID, When: the addParticipantToEvent is called, Then: the participant is added to the event', async () => {
    //Given:
    //A: Here we add a participant to the event in the event db.
    eventDb.addParticipantToEvent = mockEventDbAddingParticipantToEvent.mockResolvedValue(event);
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);

    //When:
    //A: Here we call the service method to add a participant to the event with a specific email and event ID.
    const result = await eventService.addParticipantToEvent('amelie.lammens@ucll.be', 1);

    //Then:
    expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledTimes(1);
    expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledWith('amelie.lammens@ucll.be', 1);
    expect(result).toEqual(event);
})

test('Given: a user who is already a participant to that event, When: addParticipantToEvent is called, Then: an error is thrown', async () => {
    // Given:
    //A: Here we add an error message that will be shown when the participant is already part of the event.
    const errorMessage = 'User [amelie.lammens@ucll.be] already exists in this event.';
    //A: Mocking the 'addParticipantToEvent' method to reject with the error message.
    mockEventDbAddingParticipantToEvent.mockRejectedValue(new Error(errorMessage));


    eventDb.addParticipantToEvent = mockEventDbAddingParticipantToEvent;

    // When: Add the participant to the event
    //Here we call the addParticipantToEvent method while knowing it will throw an error.
    const addParticipant = async () => await eventService.addParticipantToEvent('amelie.lammens@ucll.be', 1);

    // Then:
    //A: Here we check that the service call will throw the correct error.
    await expect(addParticipant()).rejects.toThrow(errorMessage);
    //A: Verifying that the database method was called once.
    expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledTimes(1);
    //A: Verifying that the method was called with the correct email and event ID.
    expect(mockEventDbAddingParticipantToEvent).toHaveBeenCalledWith('amelie.lammens@ucll.be', 1);
});


test('Given: a user email, When: getEventsByUserEmail is called, Then: events for the user are returned', async () => {
    // Given:
    //A: Mocking the event database method to return a list of events for the given user email.
    const userEmail = 'john.doe@ucll.be';
    const events = [event];
    eventDb.getEventsByUserEmail = mockEventDbGetAllEvents.mockResolvedValue(events);

    // When:
    //A: Here we call the service method to get events that are found by the users email
    const result = await eventService.getEventsByUserEmail(userEmail);

    // Then:
    expect(mockEventDbGetAllEvents).toHaveBeenCalledWith(userEmail);
    expect(result).toEqual(events);
});

test('Given: a participant email and event ID, When: removeEvent is called, Then: the participant is removed from the event', async () => {
    // Given:
    const email = 'john.doe@ucll.be';
    const eventId = 1;
    eventDb.removeFromMyEvents = jest.fn().mockResolvedValue(undefined);

    // When:
    const result = await eventService.removeEvent(email, eventId);

    // Then:
    expect(eventDb.removeFromMyEvents).toHaveBeenCalledWith(email, eventId);
    expect(result).toBeUndefined();
});

