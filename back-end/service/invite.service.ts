import inviteDb from "../repository/invite.db";
import userDb from "../repository/user.db";
import eventDb from "../repository/event.db";
import { Invite } from "../model/invite";

const getAll = async (): Promise<Invite[]> => {
    const invite = await inviteDb.getAll();

    if (invite.length === 0 ) {
        throw new Error('Must contain at least 1 invite.')
    }
    return invite;
};

const createInvite = async (userEmail: string, eventId: string): Promise<Invite> => {
    const userData = await userDb.getUserByEmail(userEmail);
    const event = await eventDb.getEventById(Number(eventId));

    const checkIfInviteExisted = await inviteDb.checkInviteExisted(userEmail, eventId);

    if (checkIfInviteExisted === true) {
        throw new Error(`User [${userData?.getName()}] has already been invited to ${event?.getName()}.`);
    }

    if (!userData) {
        throw new Error('User not found.');
    }

    const invite = new Invite({
        status: 'PENDING',
        user: userData,
        event: event,
    })

    return inviteDb.createInvite(invite);
    
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