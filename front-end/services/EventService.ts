import { User } from "@types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAll = () => {

  return fetch(apiUrl + "/events", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
};

const getEventById = async (eventId: string) => {
  const response = await fetch(apiUrl + `/events/details/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch event details');
  }

  return response;
};

const addParticipantToEvent = async (email: string, eventId: string) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  const response = await fetch(apiUrl + `/events/${eventId}/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add participant to event');
  }

  return response.json();
};

const getEventsByUserEmail = (email: string) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return fetch(apiUrl + `/events/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
};

const removeFromMyEvents = async (email: string, eventId: number) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return fetch(apiUrl + `/events/remove/${eventId}/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
};

const createEvent = async (eventData: EventInput) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return fetch(apiUrl + "/events/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
};



const createEvent = async (event: EventInput) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  return await fetch(apiUrl + "/events/create-event", {
    method: 'POST',
    headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(event),
  });
}


const EventService = {
  getAll,
  getEventById,
  addParticipantToEvent,
  getEventsByUserEmail,
  removeFromMyEvents,
  createEvent,
}

export default EventService;