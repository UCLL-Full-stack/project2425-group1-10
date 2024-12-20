import { EventInput } from "types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAll = async () => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const getTicketsByUserEmail = async (email: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + `/tickets/${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
}

const getTicketsByEventId = async (eventId: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + `/tickets/event/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const userBuyTicket = async (ticketId: string, email: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    const response = await fetch(apiUrl + `/tickets/purchase/${ticketId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user: email }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add participant to event');
    }

    return response.json();
};

const removeTicketFromUser = async (ticketId: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + `/tickets/${ticketId}/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

const createTicket = async (ticketType: string, ticketPrice: number, eventData: EventInput) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
    const ticketData = { type: ticketType, cost: ticketPrice, event: eventData };

    return fetch(apiUrl + '/tickets/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
    });
}

const TicketService = {
    getAll,
    getTicketsByEventId,
    userBuyTicket,
    removeTicketFromUser,
    getTicketsByUserEmail,
    createTicket,
};

export default TicketService;