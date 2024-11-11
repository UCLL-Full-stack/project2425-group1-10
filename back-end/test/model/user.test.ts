
import { Event } from '../../model/event';
import { User } from '../../model/user';

//Sample data for the user
// Sample data for the user
const username = 'Juliette101';
const name = 'Juliette Warner';
const email = 'julietteWarner1@gmail.be';
const password = 'test125';
const age = 19;
const participant: User[] = [];
type Role = 'participant' | 'organizer';
const role: Role = 'participant';


//Tests
test('Given: valid values for user, When: user is created, Then: user is created with those values.', () => {
    //Given
    const user = new User({ username, name, email, password, age, role })

    //When

    //Then
    expect(user.getUsername()).toEqual(username);
    expect(user.getName()).toEqual(name);
    expect(user.getEmail()).toEqual(email);
    expect(user.getPassword()).toEqual(password);
    expect(user.getAge()).toEqual(age);
    expect(user.getRole()).toEqual(role);
});

test('Given: empty username, when: user is made, then: an error is thrown.', () => {
    //Given
    const invalidUserName = '';

    //When
    const NewUser = () => {
        new User({ username: invalidUserName, name, email, password, age, role })
    };
    //Then
    expect(NewUser).toThrow('Username can not be empty');
});


test('Given: invalid name, when: user is made, then: an error is thrown', () => {
    //Given
    const invalidName = '';

    //When
    const newUser = () => {
        new User({ username, name: invalidName, email, password, age, role })
    };

    //Then
    expect(newUser).toThrow('Name can not be empty.')
})

test('Given: invalid password, when: user is made, then: an error is thrown', () => {
    // Given
    const invalidPassword = '';

    // When
    const newUser = () => {
        new User({ username, name, email, password: invalidPassword, age, role });
    };

    // Then
    expect(newUser).toThrow('Password can not be empty.');
});

test('Given: invalid age, when: user is made, then: an error is thrown', () => {
    // Given
    const invalidAge = -5;  // Invalid age (negative value)

    // When
    const newUser = () => {
        new User({ username, name, email, password, age: invalidAge, role });
    };

    // Then
    expect(newUser).toThrow('Age must be a positive integer.');

});

test('Given: invalid email, when: user is made, then: an error is thrown', () => {
    //Given
    const invalidEmail = 'invalidEmailFormat';

    //When
    const newUser = () => {
        new User({ username, name, email: invalidEmail, password, age, role });
    };

    //Then
    expect(newUser).toThrow('Invalid email format.');
});

test('Given: invalid role, when: user is made, then: an error is thrown', () => {
    //Given
    const invalidRole = 'Singer';

    //When
    const newUser = () => {
        new User({ username, name, email, password, age, role: invalidRole as Role });
    };

    //Then
    expect(newUser).toThrow('Invalid role. Role must be either "participant" or "organizer".');
});