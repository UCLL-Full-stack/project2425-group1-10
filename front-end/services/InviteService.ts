const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAll = async () => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/invites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
};

const getInvitesByEventId = async (eventId: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/invites/' + eventId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
};

const createInvite = async (emails: string[], eventId: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/invites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({emails, eventId}),
    });
};

const getInvitesByUserEmail = async (email: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/invites/user/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
};

const changeInviteStatus = async (inviteId: string, answer: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/invites/status/' + inviteId + '/' + answer, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
};

const InviteService = {
    getAll,
    createInvite,
    getInvitesByEventId,
    getInvitesByUserEmail,
    changeInviteStatus,
}

export default InviteService;