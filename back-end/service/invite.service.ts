import inviteDb from "../repository/invite.db";
import userDb from "../repository/user.db";
import eventDb from "../repository/event.db";
import { Invite } from "../model/invite";
import { UserInput } from "../types";
import { UserArgs } from "@prisma/client/runtime/library";
import { User } from "../model/user";

const getAll = async (): Promise<Invite[]> => {
    const invites = await inviteDb.getAll();
    return invites;
};

const createInvite = async (userEmails: string[], eventId: string): Promise<Invite> => {
    const event = await eventDb.getEventById(Number(eventId));

    const usersArray: User[] = [];

    // userEmails.forEach(async userEmail => {        
    //     let userData = await userDb.getUserByEmail(userEmail);
    //     let checkIfInviteExisted = await inviteDb.checkInviteExisted(userEmail, eventId);

    //     if (checkIfInviteExisted === true) {
    //         throw new Error(`User [${userData?.getName()}] has already been invited to ${event?.getName()}.`);
    //     }

    //     if (!userData) {
    //         throw new Error('User not found.');
    //     } else {
    //         usersArray.push(userData as User);
    //     }
    // });

    await Promise.all(userEmails.map(async userEmail => {
        let userData = await userDb.getUserByEmail(userEmail);
        let checkIfInviteExisted = await inviteDb.checkInviteExisted(userEmail, eventId);

        if (checkIfInviteExisted === true) {
            throw new Error(`User [${userData?.getName()}] has already been invited to ${event?.getName()}.`);
        }

        if (!userData) {
            throw new Error('User not found.');
        } else {
            let user = new User({
                id: userData.id,
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                age: userData.age,
                role: userData.role
            });

            usersArray.push(user);
        }
    }));

    const inviteData = new Invite({
        status: "PENDING",
        users: usersArray,
        event: event
    });

    return inviteDb.createInvite(inviteData);
};

const getInvitesByEventId = async (eventId: string): Promise<Invite[]> => {
    const invites = await inviteDb.getInvitesByEventId(eventId);
    return invites;
};

const getInvitesByUserEmail = async (email: string): Promise<Invite[]> => {
    const invites = await inviteDb.getInvitesByUserEmail(email);
    return invites;
}

const changeInviteStatus = async (inviteId: string, status: string): Promise<Invite> => {
    const inviteStatusChange = await inviteDb.changeInviteStatus(inviteId, status);
    return inviteStatusChange;
}

export default {
    getAll,
    createInvite,
    getInvitesByEventId,
    getInvitesByUserEmail,
    changeInviteStatus,
};