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
import { get } from "http";
import InviteService from "@services/InviteService";

const MyEvents: React.FC = () => {
    const router = useRouter();
    const [myEvents, setMyEvents] = useState<Array<Event>>();
    const [myFavoriteEvents, setMyFavoriteEvents] = useState<Array<Event>>();
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
            getInvitesByUserEmail(loggedUser.email);
            getFavoriteEventsByUserEmail(loggedUser.email);
        }
    }, [loggedUser]);

    const getEventsByUserEmail = async (email: string) => {
        const response = await EventService.getEventsByUserEmail(email);
        const ticketsData = await response.json();
        setTickets(ticketsData);
    }

    const getInvitesByUserEmail = async (email: string) => {
        const response = await InviteService.getInvitesByUserEmail(email);
        const invitesData = await response.json();
        const acceptedInvites = invitesData.filter(invite => invite.status === 'ACCEPT');
        const eventsData = acceptedInvites.map(invite => invite.event);
        setMyEvents(eventsData);
    }

    const getFavoriteEventsByUserEmail = async (email: string) => {
        const response = await UserService.getFavoriteEventsByUserEmail(email);

        console.log(response);

        const favoriteEventsData = await response.json();

        console.log(favoriteEventsData);

        setMyFavoriteEvents(favoriteEventsData);
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
                            <h1>My Events</h1>
                            <TicketOverview tickets={tickets} showDeleteButton={true} />
                        </section>
                    ) : (
                        <section className={styles.myEvents}>
                            <h1>My Events</h1>
                            <p className="text-white">You have not purchased any events yet...</p>
                        </section>
                    )
                )}
                {myEvents && (
                    myEvents.length > 0 && (
                        <section className={styles.myEvents}>
                            <h1>My Invites</h1>
                            <EventOverview events={myEvents} showDeleteButton={false} showLikeButton={false} email={loggedUser.email} />
                        </section>
                    ))
                }
                {myFavoriteEvents && (
                    myFavoriteEvents.length > 0 && (
                        <section className={styles.myEvents}>
                            <h1>My Favorites</h1>
                            <EventOverview events={myFavoriteEvents} showDeleteButton={false} showLikeButton={false} email={loggedUser.email} />
                        </section>
                    ))
                }
            </main>
        </>
    )
};

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserService from "@services/UserService";
export const getServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default MyEvents;