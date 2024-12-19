import { Invite } from "../../model/invite";
import { Ticket } from "../../model/ticket";
import { User } from "../../model/user";
import eventDb from "../../repository/event.db";
import inviteDb from "../../repository/invite.db";
import ticketDb from "../../repository/ticket.db";
import userDb from "../../repository/user.db";
import inviteService from "../../service/invite.service";
import ticketService from "../../service/ticket.service";
import { InviteInput, Role } from "../../types";


const user = new User({
    username: 'johndoe',
    name: 'john',
    email: 'john.doe@ucll.be',
    password: 'johnd123',
    age: 19,
    role: 'participant' as Role,
    events: [],
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

const invite = {
    status: 'PENDING',
    user: user,
    event: event,
}

let createInviteMock: jest.Mock;
let mockInviteDbGetAll: jest.Mock;
let mockInviteDbCreateInvite: jest.Mock;
let mockInviteDbCheckInviteExisted: jest.Mock;
let mockInviteDbGetInvitesByEventId: jest.Mock;
let mockInviteDbGetInvitesByUserEmail: jest.Mock;
let mockInviteDbChangeInviteStatus: jest.Mock;

let mockUserDbGetUserById: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockEventDbGetEventById: jest.Mock;

beforeEach(() => {
    createInviteMock = jest.fn();
    mockInviteDbGetAll = jest.fn();
    mockInviteDbCreateInvite = jest.fn();
    mockInviteDbCheckInviteExisted = jest.fn();
    mockInviteDbGetInvitesByEventId = jest.fn();
    mockInviteDbGetInvitesByUserEmail = jest.fn();
    mockInviteDbChangeInviteStatus = jest.fn();

    mockUserDbGetUserByEmail = jest.fn();
    mockEventDbGetEventById = jest.fn();
    mockUserDbGetUserById = jest.fn();

    inviteDb.getInvitesByEventId = mockInviteDbGetInvitesByEventId;
})

afterEach(() => {
    jest.clearAllMocks();
})

//GetAll
//happy
test('Given: a need to see all invites, when: getAll is called, then all invites are returned', async () => {
    //Given:
    const invites = [invite]
    inviteDb.getAll = mockInviteDbGetAll.mockResolvedValue(invites);


    const result = await inviteService.getAll();

    expect(mockInviteDbGetAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(invites);
});

//unhappy
test('Given: no invites, When: getAll is called, Then: an error is thrown', async () => {
    //Given:
    inviteDb.getAll = mockInviteDbGetAll.mockResolvedValue([]);

    //When + Then:
    await expect(inviteService.getAll()).rejects.toThrow('Must contain at least 1 invite.');
    expect(mockInviteDbGetAll).toHaveBeenCalledTimes(1)
})


//createInvite:


//happy
// test('Given: valid user email and event ID, When: createInvite is called, Then: an invite is successfully created', async () => {
//     eventDb.getEventById = mockEventDbGetEventById.mockResolvedValue(event);
//     userDb.getUserById = mockUserDbGetUserById.mockRejectedValue(user);

//     const createInvite = async () => {
//         await inviteService.createInvite({user: mockUserDbGetUserByEmail, event: mockInviteDbGetInvitesByEventId})
//     }

//     expect(createInviteMock).toHaveBeenCalledTimes(1);
//     expect(createInviteMock).toHaveBeenCalledWith(new Invite({    status: 'PENDING',
//         user: user,
//         event: event,}))
// });


//unhappy
test('Given: a user already invited to the event, When: createInvite is called, Then: an error is thrown', async () => {
    // Given:
    const userEmail = 'john.doe@example.com';
    const eventId = '1';
    const userData = { getName: () => 'John Doe' };  // Mocked user data
    const event = { getName: () => 'Sample Event' };  // Mocked event


    userDb.getUserByEmail = jest.fn().mockResolvedValue(userData);
    eventDb.getEventById = jest.fn().mockResolvedValue(event);
    inviteDb.checkInviteExisted = jest.fn().mockResolvedValue(true);

    // When & Then:
    await expect(inviteService.createInvite(userEmail, eventId)).rejects.toThrow(
        `User [John Doe] has already been invited to Sample Event.`
    );

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(userEmail);
    expect(eventDb.getEventById).toHaveBeenCalledWith(Number(eventId));
    expect(inviteDb.checkInviteExisted).toHaveBeenCalledWith(userEmail, eventId);
});



//getinvitesByeventid
//happy
test('Given: no invites for the event, When: getInvitesByEventId is called, Then: it returns an empty array', async () => {
    const mockEventId = '123';

    mockInviteDbGetInvitesByEventId.mockResolvedValue([]);
    
    const result = await inviteService.getInvitesByEventId(mockEventId);

    expect(mockInviteDbGetInvitesByEventId).toHaveBeenCalledWith(mockEventId);

    expect(result).toEqual([]);
});

//unhappy
test('given an empty string eventId, when getInvitesByEventId is called, then an error is thrown', async () => {
    // given
    const invalidEventId = ''; // Empty string

    
    mockInviteDbGetInvitesByEventId.mockResolvedValue([]);

    // when & then
    await expect(inviteService.getInvitesByEventId(invalidEventId)).rejects.toThrow('EventId must be a string and cannot be empty.');
});
//unhappy 2
test('Given: a wrong eventId, when getInvitesByEventId is called, then an error is thrown', async () => {
    // given
    const invalidEventId: number = 12345; // Non-string, number

    
    mockInviteDbGetInvitesByEventId.mockResolvedValue([]);

    // when & then
    await expect(inviteService.getInvitesByEventId(invalidEventId as any)).rejects.toThrow('EventId must be a string and cannot be empty.'); //here it is like the type of invalideventid is anything which isnt what we want we want a string thats why its error 
});



//getinvitesbyuseremail
//happy
test('Given: a valid email, when: getInviteByUserEmail is called, then: the correct invite is returned.', async () => {
    //Given:
    inviteDb.getInvitesByUserEmail = mockInviteDbGetInvitesByUserEmail.mockResolvedValue(invite);

    //When:
    const result = await inviteService.getInvitesByUserEmail('john.doe@ucll.be');

    expect(mockInviteDbGetInvitesByUserEmail).toHaveBeenCalledTimes(1);
    expect(mockInviteDbGetInvitesByUserEmail).toHaveBeenCalledWith('john.doe@ucll.be');
    expect(result).toEqual(invite);
})

//unhappy
test('Given: an invalid email format, When: getInvitesByUserEmail is called, Then: an error is thrown.', async () => {
    //Given:
    const invalidEmail = 'thisformat_iswrong';

    //When and Then:
    await expect(inviteService.getInvitesByUserEmail(invalidEmail)).rejects.toThrow('Invalid email format.')
})

//changeinvitestatus
//happy
// test('Given: valid inviteId and status, When: changeInviteStatus is called, Then: status is successfully updated', async () => {
//     // Given: valid inviteId and status
//     const inviteId = '12345';
//     const newStatus = 'ACCEPTED';

//     // Mocking the database function to simulate a successful update
//     mockInviteDbChangeInviteStatus.mockResolvedValue({
//         inviteId: inviteId,
//         status: newStatus,
//     });

//     // When: Calling changeInviteStatus
//     const updatedInvite = await inviteService.changeInviteStatus(inviteId, newStatus);

//     // Then: The invite's status should be updated successfully
//     expect(updatedInvite.getStatus()).toBe(newStatus);  // Expect the status to match the new status
//     expect(mockInviteDbChangeInviteStatus).toHaveBeenCalledWith(inviteId, newStatus);  // Ensure the DB function was called correctly
// });


//unhappy
test('Given: an invalid inviteId (empty string), When: changeInviteStatus is called, Then: an error is thrown', async () => {
    // Given: invalid inviteId
    const invalidInviteId = '';
    const validStatus = 'ACCEPTED';

    // When: Calling changeInviteStatus
    const changeStatus = async () => await inviteService.changeInviteStatus(invalidInviteId, validStatus);

    // Then: Error is thrown for invalid inviteId
    await expect(changeStatus).rejects.toThrow('inviteId must be a non-empty string.');
});

test('Given: an invalid status, When: changeInviteStatus is called, Then: an error is thrown', async () => {
    // Given: valid inviteId but invalid status
    const validInviteId = '12345';
    const invalidStatus = 'INVALID_STATUS';

    // When: Calling changeInviteStatus
    const changeStatus = async () => await inviteService.changeInviteStatus(validInviteId, invalidStatus);

    // Then: Error is thrown for invalid status
    await expect(changeStatus).rejects.toThrow('Invalid status provided. Must be one of: PENDING, ACCEPTED, DECLINED.');
});
