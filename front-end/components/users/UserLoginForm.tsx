import React, { useState } from "react";
import styles from '@styles/home.module.css';
import { StatusMessage } from "types";
import { useRouter } from "next/router";
import UserService from "@services/UserService";
import classNames from "classnames";

const UserLoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [showSuccessIcon, setShowSuccessIcon] = useState<boolean>(false);


    const clearErrors = () => {
        setErrorMessage("");
        setStatusMessages([]);
    };

    const validation = (): boolean => {
        if (!email || email.trim() === "") {
            setErrorMessage("Email is required.");
            return false;
        }

        if (!password || password.trim() === "") {
            setErrorMessage("Password is required.");
            return false;
        }

        return true;
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!validation()) {
            return;
        }

        // Clear all errors
        clearErrors();

        const user = { email: email, password: password };
        const response = await UserService.loginUser(user);

        console.log(response.status);

        if (response.status === 200) {
            setShowSuccessIcon(true);

            const user = await response.json();
            localStorage.setItem("loggedInUser",
                JSON.stringify({
                    token: user.token,
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                })
            );

            setTimeout(() => {
                router.push('/');
            }, 2000);

        } else if (response.status === 401) {
            // console.log(response);
            const responseBody = await response.json();
            // console.log(responseBody);

            setStatusMessages([{ message: responseBody.message, type: 'error' }]);

        } else {
            setStatusMessages([
                {
                    message: 'An error has occured. Please try again later.',
                    type: 'error',
                }
            ]);
        };
    }

    const handleShowSignupForm = () => {
        router.push('/signup');
    }

    return (
        <>
            <form
                onSubmit={handleFormSubmit}
                className={styles.loginMyEvents}>
                {statusMessages && (
                    <div className="row">
                        <ul>
                            {statusMessages.map(({ message, type }, index) => (
                                <li
                                    key={index}
                                    className={styles.loginStatusMessage}
                                >
                                    <img src="/icons/close-red.png" alt="error" width="40px" height="40px" />
                                    <p >{message}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showSuccessIcon &&
                    <>
                        <img
                            src="/icons/check-green.png"
                            alt="success" width="40px"
                            height="40px"
                            className={styles.loginSuccessIcon} />
                        <p
                            className={styles.loginSuccessMessage}
                        >
                            Login successful. Redirecting to homepage...
                        </p>
                    </>
                }

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>

                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className={styles.myEventsLoginSignupButtons}>
                    <button type="submit">
                        Log in
                    </button>

                    <button
                        type="button"
                        className={styles.myEventsSignupButton}
                        onClick={handleShowSignupForm}>
                        Sign up
                    </button>
                </div>

                {errorMessage && (
                    <p className={styles.loginErrorMessage}>
                        {errorMessage}
                    </p>
                )}
            </form>
        </>);
};

export default UserLoginForm;