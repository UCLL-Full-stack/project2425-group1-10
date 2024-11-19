import EventOverview from "@components/events/EventOverview";
import Header from "@components/header";
import EventService from "@services/EventService";
import Head from "next/head";
import { useEffect, useState } from "react";
import { EventInput } from "types";
import styles from '@styles/home.module.css';

const MyEvents: React.FC = () => {
    const [myEvents, setMyEvents] = useState<Array<Event>>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForm, setShowForm] = useState(true);

    // useEffect(() => {
    //     getEventsByUserEmail();
    // }, [myEvents]);

    const getEventsByUserEmail = async () => {
        const events = await EventService.getEventsByUserEmail(email);
        // const events = await response.json();

        const sortedEvents = events.sort((a: EventInput, b: EventInput) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setMyEvents(sortedEvents);
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowForm(false);
        getEventsByUserEmail();
    };

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
            {showForm && (

                <form 
                    onSubmit={handleFormSubmit} 
                    className={styles.loginMyEvents}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className={styles.myEventsLoginSignupButtons}>
                        <button type="submit">Log in</button>
                        <button type="button" className={styles.myEventsSignupButton}>Sign up</button>
                    </div>
                </form>
            )}
            { myEvents && (
                myEvents.length > 0 ? (
                    <section className={styles.myEvents}>
                        <h1>My events</h1>
                        <EventOverview events={myEvents} />
                    </section>
                ) : <p>No events</p>
            )}
            </main>
        </>
    )
};

export default MyEvents;