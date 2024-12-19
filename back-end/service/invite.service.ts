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
    if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
        throw new Error('EventId must be a string and cannot be empty.');
    }

    const invites = await inviteDb.getInvitesByEventId(eventId);
    return invites;
};

const getInvitesByUserEmail = async (email: string): Promise<Invite[]> => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error('Invalid email format.');

    }
    const invites = await inviteDb.getInvitesByUserEmail(email);

    

    return invites;
}

const changeInviteStatus = async (inviteId: string, status: string): Promise<Invite> => {
    // Validate inviteId
    if (!inviteId || typeof inviteId !== 'string' || inviteId.trim().length === 0) {
        throw new Error('inviteId must be a non-empty string.');
    }

    // Validate status
    const validStatuses = ['PENDING', 'ACCEPTED', 'DECLINED'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status provided. Must be one of: PENDING, ACCEPTED, DECLINED.');
    }
    

    // Proceed with changing the invite status in the database
    const inviteStatusChange = await inviteDb.changeInviteStatus(inviteId, status);
    return inviteStatusChange;
};

export default {
    getAll,
    createInvite,
    getInvitesByEventId,
    getInvitesByUserEmail,
    changeInviteStatus,
};