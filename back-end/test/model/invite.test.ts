import { Invite } from '../../model/invite';

// Sample data for the invite
const status = 'pending';
const email = 'test@example.com';

test('Given: valid values for invite When: when the invite is created Then: invite is created.', () => {

    //Given:
    const invite = new Invite({ status, email });

    //When:
    const createdInvite = invite

    //Then:
    expect(createdInvite.getStatus()).toEqual(status);
    expect(createdInvite.getEmail()).toEqual(email);
})

test('Given: invalid status, when: invite is created, then: an error is thrown', () => {
    // Given
    const invalidStatus = 'invalidStatus' as 'pending' | 'confirmed' | 'declined';

    // When
    const createInvite = () => {
        new Invite({ status: invalidStatus, email });
    };

    // Then
    expect(createInvite).toThrow('Invalid status.');
});

test('Given: invalid email format, when: invite is created, then: an error is thrown', () => {
    // Given
    const invalidEmail = 'invalid-email';

    // When
    const createInvite = () => {
        new Invite({ status, email: invalidEmail });
    };

    // Then
    expect(createInvite).toThrow('Invalid email format');
});


//Doubt on functionality
test('Given: invite with empty email, when: invite is created, then: an error is thrown', () => {
    // Given
    const emptyEmail = '';
    const status = 'pending';

    // When & Then
    const inviteWithEmptyEmail = () => {
        new Invite({ status, email: emptyEmail });
    };

    expect(inviteWithEmptyEmail).toThrow("Email can not be empty.");
});