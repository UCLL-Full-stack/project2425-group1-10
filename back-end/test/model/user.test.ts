import { User } from "../../model/user";
import { Role } from "../../types";

//sample data:
const username = "ConanG";
const name = "Conan Gray";
const email = "conangray@ucll.be";
const password = "HeatherDay";
const age = 25;


// const role = Role.'participant';

//tests
test('Given: valid values for user, when: user is created, then: user is created with those values', () => {
    const username = "ConanG";
    const name = "Conan Gray";
    const email = "conangray@ucll.be";
    const password = "HeatherDay";
    const age = 25;
    const role = 'participant' as Role;


    // Given
    const user = new User({
        username,
        name,
        email,
        password,
        age,
        role: 'participant' as Role,
        events: [],
    });

    // When
    const createdUser = user;

    // Then
    expect(createdUser.getUsername()).toEqual(username);
    expect(createdUser.getName()).toEqual(name);
    expect(createdUser.getEmail()).toEqual(email);
    expect(createdUser.getPassword()).toEqual(password);
    expect(createdUser.getAge()).toEqual(age);
    expect(createdUser.getRole()).toEqual(role);
});

test('Given: users with the same username but different details, when: compared, then: they are considered separate users', () => {
    // Given
    const user1 = new User({
        username,
        name: "Different Name",
        email: "differentemail@ucll.be",
        password,
        age: 30,
        role: 'participant' as Role, // Corrected enum access
        events: [],
    });

    const user2 = new User({
        username,
        name,
        email,
        password,
        age,
        role: 'participant' as Role, // Corrected enum access
        events: [],
    });

    // When
    const areEqual = user1.equals(user2);

    // Then
    expect(areEqual).toBe(false); // Different users despite the same username
});


test('Given: a password shorter than 8 characters, when: wanting to create a user, then: error is thrown.', () => {
    // Given
    const shortPassword = "1234567";

    // When
    const createUser = () => new User({
        username,
        name,
        email,
        password: shortPassword,
        age,
        role: 'participant' as Role,
        events: [],
    });

    // Then
    expect(createUser).toThrow("Password must be at least 8 characters long.");
});

//invalid name => if they are empty
test('Given: an invalid name, When: wanting to receive name, then: an error is thrown', () => {
    //Given:
    const invalidName = ''

    //When:
    const createUser = () => new User({
        username,
        name: invalidName,
        email,
        password,
        age,
        role: 'participant' as Role,
        events: [],
    });

    //Then:
    expect((createUser)).toThrow('Name can not be empty.')
});

//invalid username =>  if they are empty
test('Given: an invalid username, When: wanting to make user, then: an error is thrown', () => {
    //Given:
    const invalidUserName = ''

    //When:
    const createUser = () => new User({
        name,
        username: invalidUserName,
        email,
        password,
        age,
        role: 'participant' as Role,
        events: [],
    });

    //Then:
    expect((createUser)).toThrow('Username can not be empty.')
});


//invalid email => dont follow format
test('Given: an invalid email format, when wanting to create user, then: an error is thrown.', () => {
    //Given:
    const invalidemail = 'This_is_an_invalid_email_format';

    //When:
    const createUser = () => new User({
        name: 'Test User',
        username: 'testuser',
        email: invalidemail,
        password: 'securepassword123',
        age: 25,
        role: 'participant' as Role,
        events: [],
    })
    expect(createUser).toThrow('Email must be in a valid format.');

})


//invalid age =>  between 18-101
test('Given: an age outside the range of 18-101, When: wanting to create a user, Then: an error is thrown', () => {
    // Given: wrong ages
    const tooYoung = 17;
    const tooOld = 102;

    // When:
    const createTooYoungUser = () => new User({
        username: "youngUser",
        name: "Young User",
        email: "younguser@example.com",
        password: "Password123",
        age: tooYoung,
        role: 'participant' as Role,
        events: [],
    });

    const createTooOldUser = () => new User({
        username: "oldUser",
        name: "Old User",
        email: "olduser@example.com",
        password: "Password123",
        age: tooOld,
        role: 'participant' as Role,
        events: [],
    });

    // Then:
    expect(createTooYoungUser).toThrow("Age needs to be between 18 and 101.");
    expect(createTooOldUser).toThrow("Age needs to be between 18 and 101.");
});


