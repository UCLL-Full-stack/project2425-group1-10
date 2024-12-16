import { TicketInput } from "types";
import styles from '@styles/home.module.css';
import TicketService from "@services/TicketService";
import { useState } from "react";
import { useRouter } from "next/router";

type Props = {
    tickets: TicketInput[],
    showDeleteButton: boolean,
};

const TicketOverview: React.FC<Props> = ({ tickets, showDeleteButton }: Props) => {
    const [myTickets, setMyTickets] = useState(tickets);

    const router = useRouter();

    const handleEventClick = (eventId: number) => {
        sessionStorage.setItem('eventId', eventId.toString());
        router.push(`/upcoming-events/${eventId}`);
      };

    const removeEvent = async (ticketId: number) => {
        const response = await TicketService.removeTicketFromUser(ticketId.toString());
        // Renew the events list when an event is removed
        setMyTickets(myTickets.filter(ticket => ticket.id !== ticketId));
    }

    return (
        <>
            <section className={styles.holder}>
                {myTickets && myTickets.length > 0 ? (
                    <div className={styles.events}>
                        {myTickets.map((ticket, index) => (
                            <div
                                key={index}
                                className={styles.event}
                                style={{ backgroundImage: `url(${ticket.event.backgroundImage})` }}
                                onClick={() => handleEventClick(ticket.event.id)}
                                role="button"
                            >
                                <div className={styles.overlay}></div>
                                <h3>{ticket.event.name}</h3>
                                {/* <p className={styles.desc}>{ticket.event.description}</p> */}
                                {/* <p>{new Date(ticket.event.date).toLocaleDateString()}</p> */}
                                <p>{ticket.type} €{ticket.cost}</p>

                                <div>
                                    {showDeleteButton === true &&
                                        <button
                                            className={styles.removeButton}
                                            onClick={(e) => {
                                                // Instead of triggering handleEventClick, it should trigger removeEvent
                                                e.stopPropagation();
                                                removeEvent(ticket.id);
                                            }}
                                        ><img src="/icons/close-white.png" alt="Close icon" width="40px" height="40px" />
                                        </button>
                                    }
                                </div>
                            </div>

                        ))}
                    </div>) : (
                    <p className="text-white">You don't have any events...</p>
                )}
            </section>
        </>
    )
}

export default TicketOverview;