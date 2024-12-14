import { User } from "../model/user";
import userDb from "../repository/user.db"

const getAllUsers = async (): Promise<User[]> => {

    const users = await userDb.getAllUsers();
    if (!users || users.length === 0) {
        throw new Error("No users found");
    }
    return users;
    
    // return userDb.getAllUsers();
};

const getUserById = async (id: number): Promise<User | null> => {
    // return userDb.getUserById({ id });
    const user = await userDb.getUserById({ id });
    if (!user) {
        throw new Error("User doesn't exist");
    }
    return user;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await userDb.getUserByEmail(email);
    if (!user) {
        throw new Error("User doesn't exist");
    }
    return user;
    // return userDb.getUserByEmail(email);
};

export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
}