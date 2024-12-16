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

const getTicketsByEventId = async (eventId: string) => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    console.log(eventId);

    return fetch(apiUrl + `/tickets/${eventId}`, {
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

const TicketService = {
    getAll,
    getTicketsByEventId,
    userBuyTicket,
    removeTicketFromUser,
};

export default TicketService;