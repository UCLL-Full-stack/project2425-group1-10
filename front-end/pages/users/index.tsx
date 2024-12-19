import Header from "@components/header";
import UserOverview from "@components/users/UserOverview";
import Head from "next/head";
import { useState } from "react";
import styles from '@styles/home.module.css';
import useSWR from 'swr';
import UserService from "@services/UserService";

const fetcher = (url: string) => UserService.getAll().then(res => res.json());

const Users: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = loggedInUser ? JSON.parse(loggedInUser) : null;

    const { data: users, error } = useSWR(user && user.role === 'ADMIN' ? '/api/users' : null, fetcher);

    if (error) {
        setErrorMessage("Failed to load users.");
        setShowErrorMessage(true);
    }

    return (
        <>
            <Head>
                <title>Users overview</title>
                <meta name="description" content="List of all users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.usersMain}>
                {users && <UserOverview usersData={users} />}

                {showErrorMessage && (
                    <p className="mt-3">
                        {errorMessage}
                    </p>
                )}
            </main>
        </>
    );
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

export default Users;