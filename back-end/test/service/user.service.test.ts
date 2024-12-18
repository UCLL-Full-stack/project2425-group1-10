import { User } from "../../model/user";
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";
import { Role } from "../../types";

const user = new User({
    username: "BritneyS",
    name: "Britney",
    email: "Britney.Spears@ucll.be",
    password: "testingthis123",
    age: 19,
    role: 'participant' as Role,
})


let mockUserDbGetAllUsers: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbGetUserByEmail: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbGetUserByEmail = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

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