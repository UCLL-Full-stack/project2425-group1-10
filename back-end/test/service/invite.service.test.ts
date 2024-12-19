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
});

const event = {
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
test('Given: no invites, When: getAll is caleld, Then: an error is thrown', async () => {
    //Given:
    inviteDb.getAll = mockInviteDbGetAll.mockResolvedValue([]);

    //When + Then:
    await expect(inviteService.getAll()).rejects.toThrow('Must contain at least 1 invite.');
    expect(mockInviteDbGetAll).toHaveBeenCalledTimes(1)
})


//createInvite:
//happy





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

//unhappy



//getinvitesbyuseremail
//happy

//unhappy




//changeinvitestatus
//happy

//unhappy