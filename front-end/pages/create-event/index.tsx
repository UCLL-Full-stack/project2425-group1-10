import React from "react";
import Header from "@components/header";
import Head from "next/head";
import CreateEventForm from "@components/events/CreateEventForm"; // Import your form
import styles from '@styles/home.module.css';

const CreateEvent: React.FC = () => {
    return (
        <>
            <Head>
                <title>Create Event</title>
                <meta name="description" content="Create a new event for users to explore" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.mainWrapperCompact}> {/* Compact wrapper */}
                <div className={styles.formContainerCompact}> {/* Adjusted form container */}
                    <h1 className={styles.formTitle}>Create Event</h1> {/* Page title */}
                    <CreateEventForm /> {/* Event form */}
                </div>
            </main>
        </>
    );
};

export default CreateEvent;