import { Invite } from '../model/invite';
import { User } from '../model/user';
import database from './database';

const getAll = async (): Promise<Invite[]> => {
    const invitesPrisma = await database.invite.findMany({
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return invitesPrisma.map(Invite.from);
};

const checkInviteExisted = async (userEmail: string, eventId: string): Promise<boolean> => {
    const invitesPrisma = await database.invite.findMany({
        where: {
            user: {
                email: userEmail,
            },
            event: {
                id: parseInt(eventId),
            }
        }
    });

    if (invitesPrisma.length > 0) {
        return true;
    } else {
        return false;
    }

}

const createInvite = async (invite: Invite): Promise<Invite> => {
    const invitePrisma = await database.invite.create({
        data: {
            status: 'PENDING',
            user: {
                connect: {
                    id: invite.getUser().getId(),
                },
            },
            event: {
                connect: {
                    id: invite.getEvent().getId(),
                },
            },
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return Invite.from(invitePrisma);
};

const getInvitesByEventId = async (eventId: string): Promise<Invite[]> => {
    const invitesPrisma = await database.invite.findMany({
        where: {
            eventId: Number(eventId),
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return invitesPrisma.map(Invite.from);
};

const getInvitesByUserEmail = async (email: string): Promise<Invite[]> => {
    const userPrisma = await database.user.findUnique({
        where: {
            email,
        },
    });

    if (!userPrisma) {
        throw new Error('User not found.');
    }

    const invitesPrisma = await database.invite.findMany({
        where: {
            userId: userPrisma.id,
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return invitesPrisma.map(Invite.from);
}

const changeInviteStatus = async (inviteId: string, statusData: string): Promise<Invite> => {
    const invitePrisma = await database.invite.update({
        where: {
            id: parseInt(inviteId, 10),
        },
        data: {
            status: statusData,
        },
        include: {
            user: {include: {events: true}},
            event: true,
        },
    });

    return Invite.from(invitePrisma);

}

export default {
    getAll,
    createInvite,
    getInvitesByEventId,
    getInvitesByUserEmail,
    changeInviteStatus,
    checkInviteExisted,
};
