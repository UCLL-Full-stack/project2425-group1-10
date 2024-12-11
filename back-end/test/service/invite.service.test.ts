import { Invite } from "../../model/invite";

const validInvite = new Invite({
    status: 'pending',
    email: 'test@ucll.be'
})

const existingEmail = new Invite({
    status: 'confirmed',
    email: 'existAlready@ucll.be'
})


let createInviteMock: jest.Mock;

let mockInviteDbGEtInviteByEmail : jest.Mock; //change maybe with status too?
let mockUpdateInviteStatus: jest.Mock;

beforeEach(() => {
    mockInviteDbGEtInviteByEmail = jest.fn();
    mockUpdateInviteStatus = jest.fn();

    createInviteMock = jest.fn();
})

//This basically clears everything after each render (check to be sure but i think it is.)
afterEach(() => {
    jest.clearAllMocks();
});


// test('given a valid invite, when invite is created, then invite is created with those values', async () => {
//     // given
//     mockInviteDbGEtInviteByEmail.mockResolvedValue(null);

//     // when
//     await inviteService.createInvite(validInvite);

//     // then
//     expect(createInviteMock).toHaveBeenCalledTimes(1);
//     expect(createInviteMock).toHaveBeenCalledWith(validInvite);
// });

// test('given an invite with an invalid email, when invite is created, then an error is thrown', () => {
//     // given
//     const invalidInvite = new Invite({
//         status: 'pending',
//         email: 'invalid-email',
//     });

//     // when
//     const createInvalidInvite = () => inviteService.createInvite(invalidInvite);

//     // then
//     expect(createInvalidInvite).rejects.toThrowError('Invalid email format');
// });

// test('given an invite with an empty email, when invite is created, then an error is thrown', () => {
//     // given
//     const invalidInvite = new Invite({
//         status: 'pending',
//         email: '',
//     });

//     // when
//     const createInvalidInvite = () => inviteService.createInvite(invalidInvite);

//     // then
//     expect(createInvalidInvite).rejects.toThrowError('Email can not be empty.');
// });

