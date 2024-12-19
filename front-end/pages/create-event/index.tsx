import React from "react";
import Header from "@components/header";
import Head from "next/head";
<<<<<<< HEAD
import CreateEventForm from "@components/events/CreateEventForm"; // Import your form
import styles from '@styles/home.module.css';
=======
import styles from '@styles/home.module.css';
import { useState } from "react";
import { UserInput } from "types";
>>>>>>> origin/Development

const CreateEvent: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<UserInput | null>(null);

    useEffect(() => {
        const localStorageUser = localStorage.getItem("loggedInUser");
        if (localStorageUser){
            setLoggedInUser(JSON.parse(localStorageUser));
        }
    }, []);

    return (
        <>
            <Head>
                <title>Create Event</title>
                <meta name="description" content="Create a new event for users to explore" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
<<<<<<< HEAD
            <main className={styles.mainWrapperCompact}> {/* Compact wrapper */}
                <div className={styles.formContainerCompact}> {/* Adjusted form container */}
                    <h1 className={styles.formTitle}>Create Event</h1> {/* Page title */}
                    <CreateEventForm /> {/* Event form */}
                </div>
=======
            <main className={styles.myEventsMain}>
                {loggedInUser && loggedInUser.role !== 'PARTICIPANT' ? (
                    <CreateEventForm />
                ) : (
                    <p className="mt-3 text-white">You are not authorised to see this page.</p>
                )}
>>>>>>> origin/Development
            </main>
        </>
    );
};

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CreateEventForm from "@components/events/CreateEventForm";
import { useEffect } from "react";
export const getServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default CreateEvent;