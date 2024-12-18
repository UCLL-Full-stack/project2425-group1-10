import exp from "constants";
import { User } from "../../model/user";
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";
import { Role, UserInput } from "../../types";

const user = new User({
    username: "BritneyS",
    name: "Britney",
    email: "Britney.Spears@ucll.be",
    password: "testingthis123",
    age: 19,
    role: 'participant' as Role,
})

let createUserMock: jest.Mock;

let mockUserDbGetAllUsers: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;
let mockUserDbCreateUser: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
    mockUserDbCreateUser = jest.fn();

    createUserMock = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});


//getUserById:

//happy paths:
test('Given: a valid user ID, When: getUserById is called, Then: the correct user is returned', async () => {
    // Given:
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user); //A: we are setting up a mock case for the getUserById method in the user db

    // When:
    //A: Here we basically call the getUserById service (method) with an ID in this example case it is one.
    const result = await userService.getUserById(1);

    // Then:
    //A: Here we check if the getUserById was called 1 time with ID 1.
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
    //A: Here we check if the result of the service call is the same to the object of the user.
    expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(user);
});

//unhappy paths:
test('Given: a user who does not exist, When: getUserById is called, Then: an error is thrown', async () => {
    // Given:
    userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(null);

    // When: calling the service to get a user by a non-existing ID
    const getUser = async () => await userService.getUserById(999);

    // Then:
    await expect(getUser()).rejects.toThrow("User doesn't exist.");
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: 999 });
});


//get userByEmail

//happy path:
test('Given: a valid email, When: getUserByEmail is called, Then: the correct user is returned', async () => {
    // Given:
    userDb.getUserByEmail = mockUserDbGetUserByEmail.mockResolvedValue(user);

    // When:
    const result = await userService.getUserByEmail('john.doe@ucll.be');

    // Then:
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByEmail).toHaveBeenCalledWith('john.doe@ucll.be');
    expect(result).toEqual(user);
});
//unhappy:
test('Given: an invalid email format, When: getUserByEmail is called, Then: an error is thrown for invalid email format', async () => {
    // Given: An invalid email
    const invalidEmail = 'invalid-email-format';

    // When & Then: Expecting an error to be thrown due to invalid email format
    await expect(userService.getUserByEmail(invalidEmail)).rejects.toThrow('Invalid email format.');
});



//getAllUsers:

//happy:
test('Given: a need to get all users, When: getAllUsers is called, Then: all users are returned.', async () => {
    // Given:
    const users = [user];
    userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue(users);

    // When:
    const result = await userService.getAllUsers();

    // Then:
    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
});

//unhappy:
test('Given: no users in the database, When: user is called, Then an error is thrown.', async () => {
    //Given:
    userDb.getAllUsers = mockUserDbGetAllUsers.mockResolvedValue([]);

    //A: When and then in a combination for efficiency:
    await expect(userService.getAllUsers()).rejects.toThrow('Must contain at least 1 user.');
    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
});


//create user:

//happy:
// test('Given: a valid user, when user is created, then user is created with those values', async () => {
//     const input = {
//         username: "BritneyS",
//         name: "Britney",
//         email: "Britney.Spears@ucll.be",
//         password: "testingthis123",
//         age: 19,
//         role: 'PARTICIPANT' as Role
//     };
//     createUserMock.mockResolvedValue(input);
//     userDb.createUser = createUserMock;

//     const result = await userService.createUser(input);

//     expect(createUserMock).toHaveBeenCalledTimes(1);
//     expect(createUserMock).toHaveBeenCalledWith(expect.objectContaining(input));
//     expect(result).toEqual(input);
// });

//unhappy:
test('Given: missing required fields, when: createUser is called, then: an error is thrown', async () => {
    // Given: user missing the "username" field
    const incompleteUser = {
        name: 'john',
        email: 'john.doe@ucll.be',
        password: 'johnd123',
        age: 19,
        role: 'participant',
    };

    mockUserDbGetUserByEmail.mockResolvedValue(null); // Simuleer dat gebruiker niet bestaat

    const incompleteUserInput = incompleteUser as UserInput;

    await expect(userService.createUser(incompleteUserInput)).rejects.toThrow("Missing required fields.")

});