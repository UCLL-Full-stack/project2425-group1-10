import Header from "@components/header"
import UserOverview from "@components/users/UserOverview"
import EventService from "@services/EventService"
import UserService from "@services/UserService"
import Head from "next/head"
import { useEffect, useState } from "react"
import { UserInput } from "types"
import styles from '@styles/home.module.css';

const Users: React.FC = () => {
    const [showUserList, setShowUserList] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [users, setUsers] = useState<UserInput[]>();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const user = loggedInUser ? JSON.parse(loggedInUser) : null;

        if (user && user.role === 'ADMIN') {
            getAll();
            setShowUserList(true);
        } else {
            setErrorMessage("You are not authorised to see this page.");
            setShowErrorMessage(true);
        }

    }, []);

    const getAll = async () => {
        const response = await UserService.getAll();
        const usersData = await response.json();
        setUsers(usersData);
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
                {showUserList &&
                    <UserOverview usersData={users} />
                }

                {showErrorMessage &&
                    <p className="mt-3">
                        {errorMessage}
                    </p>
                }
            </main >
        </>
    )
};

export default Users;