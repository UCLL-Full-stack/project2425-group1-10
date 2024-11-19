import Header from "@components/header";
import LoginOverview from "@components/login/LoginOverview";
import Head from "next/head";
import styles from '@styles/home.module.css';

const LoginPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="login" content="Login page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.loginMain}>
                <LoginOverview />
            </main>
        </>
    )
};

export default LoginPage;