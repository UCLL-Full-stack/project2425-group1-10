import Header from "@components/header";
import InviteOverview from "@components/invites/InviteOverview";
import InviteService from "@services/InviteService";
import Head from "next/head";
import { useEffect, useState } from "react";
import { InviteInput, UserInput } from "types";
import styles from '@styles/home.module.css';

const InvitesOverview: React.FC = () => {
    const [invites, setInvites] = useState<InviteInput[]>([]);
    const [showInviteList, setShowInviteList] = useState<boolean>(false);

    const [loggedUser, setLoggedUser] = useState<UserInput | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const user = loggedInUser ? JSON.parse(loggedInUser) : null;

        if (user && user.role === 'ADMIN') {
            getAllInvites();
            setShowInviteList(true);
        } else {
            setErrorMessage("You are not authorised to see this page.");
            setShowErrorMessage(true);
        }
    }, []);

    const getAllInvites = async () => {
        const response = await InviteService.getAll();
        const invitesData = await response.json();
        setInvites(invitesData);
    }

    return (
        <>
            <Head>
                <title>Invites</title>
                <meta name="description" content="Overview of all invites" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.invitesOverviewMain}>
                {showInviteList &&
                    <div>
                        <h1>All invites</h1>
                        <InviteOverview invites={invites} showEventName={true} showUserName={true} showReactButtons={false} showNotifications={false} showDownloadButton={true}/>
                    </div>
                }

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

export default InvitesOverview;