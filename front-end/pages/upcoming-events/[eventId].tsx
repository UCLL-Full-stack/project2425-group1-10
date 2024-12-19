import EventDetails from "@components/events/EventDetails";
import Header from "@components/header";
import EventService from "@services/EventService";
import TicketService from "@services/TicketService";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EventInput, InviteInput } from "types";
import styles from '@styles/home.module.css';
import InviteService from "@services/InviteService";
import InviteOverview from "@components/invites/InviteOverview";

const RenderEventDetailsById: React.FC = () => {

    const [event, setEvent] = useState<EventInput>();
    const [showForm, setShowForm] = useState(false);
    const [showInviteButton, setShowInviteButton] = useState(false);
    const [email, setEmail] = useState("");
    const [invites, setInvites] = useState<InviteInput[]>();

    // Show error message
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Show success message
    const [showStatus, setShowStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Show invite error message
    const [showInviteErrorMessage, setShowInviteErrorMessage] = useState(false);
    const [InviteErrorMessage, setInviteErrorMessage] = useState("");

    const router = useRouter();
    const { eventId } = router.query;

    const [showParticipantList, setShowParticipantList] = useState(true);

    // If user is a participant, he can not see participant list
    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const user = loggedInUser ? JSON.parse(loggedInUser) : null;

        // Only user exists people can see the participant list
        if ((user && user.role === 'PARTICIPANT') || !user) {
            setShowParticipantList(false);
        }

        if (user && (user.role === 'ADMIN' || user.role === 'ORGANIZER')) {
            setShowInviteButton(true);
        }
    }, []);

    useEffect(() => {
        if (eventId) {
            getEventById();
            getInvitesByEventId(eventId as string);
        }
    }, [eventId]);

    // Why when I do this, eventId turns null when refresh the page?
    // useEffect(() => {
    //     getEventById();
    // }, []);

    const getEventById = async () => {
        try {

            const response = await EventService.getEventById(eventId as string);
            const eventData = await response.json();
            setEvent(eventData);

        } catch (error) {
            console.error("Failed to fetch event:", error);
        }
    };

    const addSelfToEvent = async (ticketId: string, selfEmail: string) => {
        try {
            const response = await TicketService.userBuyTicket(ticketId, selfEmail);

            getEventById();

            setStatusMessage("Event has been successfully added to your 'My events' page. Redirecting...");
            setShowStatus(true);

            setTimeout(() => {
                router.push("/my-events");
            }, 2000);

        } catch (error) {
            setErrorMessage("You are already a participant of this event.");
            setShowError(true);
        }
    };

    const createInvite = async (email: string, eventId: string) => {
        setEmail("");
        setShowInviteErrorMessage(false);

        try {
            const response = await InviteService.createInvite(email, eventId);

            if (!response.ok) {
                const responseData = await response.json();
                setInviteErrorMessage(responseData.message);
                setShowInviteErrorMessage(true);
            } else {
                getInvitesByEventId(eventId);
            }

        } catch (error) {
            setInviteErrorMessage(error.message);
            setShowInviteErrorMessage(true);
        }
    };

    const getInvitesByEventId = async (eventId: string) => {
        const responseAll = await InviteService.getInvitesByEventId(eventId);
        const invites = await responseAll.json();
        setInvites(invites);
    };

    return (
        <>
            <Head>
                <title>Upcoming events</title>
                <meta name="description" content="Overview of upcoming events" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.eventDetailsMain}>
                <h1>Event Details</h1>
                {event ? (
                    <section className={styles.eventDetails}>
                        <EventDetails event={event} showParticipantList={showParticipantList} addSelfToEvent={addSelfToEvent} />
                    </section>
                ) : (
                    <p>Loading event details...</p>
                )}

                {showError && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                )}
                {showStatus && (
                    <p className={styles.statusMessage}>{statusMessage}</p>
                )}

                {showInviteButton && (
                    <>
                        <div className={styles.inviteComponent}>
                            <h3>Invite Overview</h3>
                            {invites && invites.length > 0 ? (
                                <InviteOverview
                                    invites={invites}
                                    showEventName={false}
                                    showUserName={true}
                                    showReactButtons={false}
                                    showNotifications={false}
                                    showDownloadButton={false}
                                />
                            ) : (
                                <p>No invites yet...</p>
                            )}

                            <form className={styles.inviteForm}>
                                {showInviteErrorMessage && (
                                    <p className={styles.errorMessage}>{InviteErrorMessage}</p>
                                )}
                                <label
                                    htmlFor="email"
                                >
                                    Invite a user to this event
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Implement the invite functionality
                                        createInvite(email, eventId as string);
                                    }}
                                    type="submit"
                                    className="px-4 py-2 bg-grey-500 rounded"
                                >Invite</button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </>
    )
};

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export const getServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default RenderEventDetailsById;