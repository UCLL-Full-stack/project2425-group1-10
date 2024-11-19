import UserService from '@services/UserService';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';

const LoginOverview = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await UserService.login({email, password});
            const data = await response.json();

            if (!response.ok) {
                setError("Invalid email or password.");
            } else {
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.user));
                router.push("/");
            }
        } catch (error){
            setError("An unknown error occurred.");
        }
    };

    return (
        <>
            {error && <p>{error}</p>}

            <form
                className={styles.loginMyEvents}
                onSubmit={handleSubmit}
            >
                <label
                    htmlFor="email"
                >Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    // placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                ></input>
                <label
                    htmlFor="password"
                >Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    // placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                ></input>
                <button
                    type="submit"
                >Login</button>
            </form>
        </>
    )
};

export default LoginOverview;

