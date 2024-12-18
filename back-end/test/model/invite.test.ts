import { Invite } from '../../model/invite';
import { User } from '../../model/user';
import { Event } from '../../model/event';
import { InviteStatus } from '../../types';
import { Role } from '../../types';

// Mock User and Event
const testUser = new User({
    id: 1,
    username: 'bart123',
    name: 'Bart',
    email: 'bart@example.com',
    password: 'securePass123', // Valid password (>= 8 characters)
    age: 25,
    role: 'USER' as Role,
});

const testEvent = new Event({
    id: 1,
    name: 'Taylor Swift Concert',
    description: 'A concert by Taylor Swift',
    date: new Date('2024-12-25'),
    location: 'Los Angeles, CA',
    category: 'Music',
    isTrending: true,
});

const status: InviteStatus = 'PENDING';

test('Given: valid values for invite When: the invite is created Then: invite is created.', () => {
    // Given
    const invite = new Invite({ status, user: testUser, event: testEvent });

    // When
    const createdInvite = invite;

    // Then
    expect(createdInvite.getStatus()).toEqual(status);
    expect(createdInvite.getUser()).toEqual(testUser);
    expect(createdInvite.getEvent()).toEqual(testEvent);
});

test('Given: invalid event, when: invite is created, then: an error will be thrown.', () => {
    // Given
    const invalidEvent = {} as any;  //A: will give error cause this is not ocurring in event.

    // When
    const createInvite = () =>
        new Invite({ status: 'PENDING', user: testUser, event: invalidEvent });

    // Then
    expect(createInvite).toThrow('Invalid event provided.');
});

test('Given: invalid user, when: invite is created, then: an error will be thrown.', () => {
    //Given:
    const invalidUser = {} as any; //A: same issue as above.

    //When:
    const createUser = () => {
        new Invite({status:'PENDING', user: invalidUser, event: testEvent});
    }

    //Then:
    expect(createUser).toThrow('Invalid user provided.');
})

test('Given: an invalid status, when: invite is created, then: an error will be thrown.', () => {
    //Given:
    const invalidStatus = 'THIS_IS_AN_INVALID_STATUS' as InviteStatus;
    //When:
    const createUser = () => {
        new Invite({status:invalidStatus, user: testUser, event: testEvent});
    }
    //Then:
    expect(createUser).toThrow('Invalid status provided.')

})






















// test('Given: invalid email format, when: user is created, then: an error is thrown', () => {
//     // Given
//     const invalidEmail = 'invalid-email';

//     // When
//     const createUser = () =>
//         new User({
//             id: 2,
//             username: 'john123',
//             name: 'John',
//             email: invalidEmail,
//             password: 'password123',
//             age: 30,
//             role: 'USER' as Role,
//         });

//     // Then
//     expect(createUser).toThrow('Invalid email format');
// });

// test('Given: user with empty email, when: user is created, then: an error is thrown', () => {
//     // Given
//     const emptyEmail = '';

//     // When
//     const createUser = () =>
//         new User({
//             id: 3,
//             username: 'alice123',
//             name: 'Alice',
//             email: emptyEmail,
//             password: 'password123',
//             age: 22,
//             role: 'USER' as Role,
//         });

//     // Then
//     expect(createUser).toThrow('Email cannot be empty.');
// });
