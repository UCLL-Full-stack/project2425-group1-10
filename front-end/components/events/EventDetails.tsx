import React from 'react';
import { EventInput, TicketInput } from '@types';
import styles from '@styles/home.module.css';
import { useState, useEffect } from 'react';
import TicketService from '@services/TicketService';

type Props = {
    event: EventInput;
    showParticipantList: boolean;
    addSelfToEvent: (ticketId: string, email: string) => void;
};

const EventDetails: React.FC<Props> = ({ event, showParticipantList, addSelfToEvent }: Props) => {
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showTickets, setShowTickets] = useState<boolean>(false);
    const [tickets, setTickets] = useState<TicketInput[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<UserInput>();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const user = loggedInUser ? JSON.parse(loggedInUser) : null;

        if (user) {
            //Get the tickets for this event
            getTicketsByEventId(event.id);

            setLoggedInUser(user);
            setShowTickets(true);
        } else {
            setStatusMessage("You need to log in to see the tickets for this event.");
        }
    }, []);

    const getTicketsByEventId = async (eventId: string) => {
        try {
            const response = await TicketService.getTicketsByEventId(eventId);

            const ticketData = await response.json();

            //Retrieve available tickets
            const availableTickets = ticketData.filter(ticket => ticket.user === null);

            setTickets(availableTickets);

        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        }
    };

    if (!event) {
        return <p>Loading...</p>;
    };

    return (
        <>
            <div>
                <h2>{event.name}</h2>
                <p><img src="/icons/description.png" alt="Description icon" width="20px" height="20px" /> {event.description}</p>
                <p><img src="/icons/calendar.png" alt="Calendar icon" width="20px" height="20px" /> {new Date(event.date).toLocaleDateString()}</p>
                <p><img src="/icons/location.png" alt="Location icon" width="20px" height="20px" /> {event.location}</p>
                <p><img src="/icons/category.png" alt="Category icon" width="20px" height="20px" /> {event.category}</p>

                {showTickets ? (
                    tickets.length !== 0 ? (
                        <div className={styles.eventDetailTickets}>
                            <h3>Available tickets:</h3>
                            {tickets.map((ticket, index) => (
                                <div key={index}>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-grey-500 rounded"
                                        onClick={() => addSelfToEvent(ticket.id, loggedInUser.email)}
                                    >{ticket.type} €{ticket.cost}</button>
                                </div>
                            ))}
                        </div>) : (
                        <p className="px-4 py-2 bg-black rounded mb-1 mt-3 text-white text-center">
                            Sorry... Tickets for this events have been sold out.
                        </p>
                    )
                ) : (
                    <p
                        className="px-4 py-2 bg-black rounded mb-1 mt-3 text-white text-center"
                    >{statusMessage}</p>
                )}
            </div>
        </>
    )
};

export default EventDetails;