import { User } from "../../model/user";
import { Role } from "@prisma/client";

//sample data:
const username = "ConanG";
const name = "Conan Gray";
const email = "conangray@ucll.be";
const password = "HeatherDay";
const age = 25;
const role = Role.PARTICIPANT;

//tests
test('Given: valid values for user, when: user is created, then: user is created with those values', () => {
    // Given
    const user = new User({
        username,
        name,
        email,
        password,
        age,
        role: Role.PARTICIPANT,
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
        role: Role.PARTICIPANT, // Corrected enum access
    });

    const user2 = new User({
        username,
        name,
        email,
        password,
        age,
        role: Role.PARTICIPANT, // Corrected enum access
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
        role: Role.PARTICIPANT,
    });

    // Then
    expect(createUser).toThrow("Password must be at least 8 characters long");
});



