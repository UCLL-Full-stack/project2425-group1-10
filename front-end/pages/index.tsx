import Header from "@components/header";
import Head from "next/head";
import styles from '@styles/home.module.css';
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";


const Home: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const handleLanguageChange = (event: { target: { value: string } }) => {
        // get new locale from event and push it to the router
        const newLocale = event.target.value;
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("title")}</title>
                <meta name="description" content="Eventora app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.homeLanguageHolder}>
                    <label
                        htmlFor="language">{t("language.button")}</label>
                    <select
                        id="language"
                        value={locale}
                        onChange={handleLanguageChange}
                    >
                        <option value="en">{t("language.english")}</option>
                        <option value="jp">{t("language.japanese")}</option>
                    </select>
                </div>
                <span>
                    <h1>{t("main.title")}</h1>
                </span>

                <div className={styles.description}>
                    <p>
                        {t("main.description1")} <br /><br />
                        {t("main.description2")}
                    </p>
                </div>

                <div className={styles.usersHomeTableHolder}>
                    <h2>{t("predefinedUserTable.title")}</h2>
                    <table className={styles.usersHomeTable}>
                        <thead>
                            <tr>
                                <th className={styles.usersTableth1}>{t("predefinedUserTable.email")}</th>
                                <th>{t("predefinedUserTable.password")}</th>
                                <th className={styles.usersTableth2}>{t("predefinedUserTable.role")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>admin@admin</td>
                                <td>admin</td>
                                <td>{t("predefinedUserTable.admin")}</td>
                            </tr>
                            <tr>
                                <td>john.doe@ucll.be</td>
                                <td>passwordJohn</td>
                                <td>{t("predefinedUserTable.organizer")}</td>
                            </tr>
                            <tr>
                                <td>jane.doe@ucll.be</td>
                                <td>passwordJane</td>
                                <td>{t("predefinedUserTable.participant")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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

export default Home;