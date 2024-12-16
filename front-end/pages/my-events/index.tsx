import EventOverview from "@components/events/EventOverview";
import Header from "@components/header";
import EventService from "@services/EventService";
import Head from "next/head";
import { useEffect, useState } from "react";
import { EventInput, TicketInput, UserInput } from "types";
import styles from '@styles/home.module.css';
import { useRouter } from "next/router";
import { log } from "console";
import TicketOverview from "@components/tickets/TicketOverview";

const MyEvents: React.FC = () => {
    const router = useRouter();
    const [myEvents, setMyEvents] = useState<Array<Event>>();
    const [loggedUser, setLoggedUser] = useState<UserInput | null>(null);
    const [tickets, setTickets] = useState<Array<TicketInput>>();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setLoggedUser(JSON.parse(loggedInUser));
        }
    }, []);

    useEffect(() => {
        if (loggedUser?.email) {
            getEventsByUserEmail(loggedUser.email);
        }
    }, [loggedUser]);

    const getEventsByUserEmail = async (email: string) => {
        const response = await EventService.getEventsByUserEmail(email);
        const ticketsData = await response.json();
        setTickets(ticketsData);

        // const events = ticketsData.map((ticket) => ticket.event);
        // const sortedEvents = events.sort((a: EventInput, b: EventInput) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // setMyEvents(sortedEvents);
    }

    return (
        <>
            <Head>
                <title>My events</title>
                <meta name="description" content="Overview of my upcoming events" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.myEventsMain}>
                {tickets && (
                    tickets.length > 0 ? (
                        <section className={styles.myEvents}>
                            <h1>My events</h1>
                            <TicketOverview tickets={tickets} showDeleteButton={true}/>
                        </section>
                    ) : <p className="text-white">You don't have any upcoming events...</p>
                )}
            </main>
        </>
    )
};

export default MyEvents;