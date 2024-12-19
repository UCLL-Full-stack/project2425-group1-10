import Header from "@components/header";
import InviteOverview from "@components/invites/InviteOverview";
import InviteService from "@services/InviteService";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { InviteInput, UserInput } from "types";
import styles from '@styles/home.module.css';


const MyInvites: React.FC = () => {
    const [loggedUser, setLoggedUser] = useState<UserInput | null>(null);
    const [invites, setInvites] = useState<InviteInput[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setLoggedUser(JSON.parse(loggedInUser));
        } else {
            setErrorMessage("You are not authorised to see this page.");
            setShowErrorMessage(true);
        }
    }, []);

    useEffect(() => {
        if (loggedUser?.email) {
            getInvitesByUserEmail(loggedUser.email);
        }
    }, [loggedUser]);

    useEffect(() => {
        if (loggedUser?.email) {
            getInvitesByUserEmail(loggedUser.email);
        }
    }, [invites]);

    const getInvitesByUserEmail = async (email: string) => {
        const response = await InviteService.getInvitesByUserEmail(email);
        const invitesData = await response.json();
        setInvites(invitesData);
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
            <main className={styles.invitesMain}>
                {loggedUser && (
                    <>
                        <h1>My invites</h1>
                        <InviteOverview
                            invites={invites}
                            showEventName={true}
                            showUserName={false}
                            showReactButtons={true}
                            showNotifications={true}
                            showDownloadButton={false}
                        />
                    </>
                )}

                {showErrorMessage &&
                    <p className="mt-3">
                        {errorMessage}
                    </p>
                }
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

export default MyInvites;