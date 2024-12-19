import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserInput, InviteInput, TicketInput } from '@types';
import InviteService from '../services/InviteService';
import TicketService from '../services/TicketService';
import useInterval from "use-interval";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
    const [loggedUser, setLoggedUser] = useState<UserInput>(null);
    const [invites, setInvites] = useState<InviteInput[]>();
    const [tickets, setTickets] = useState<TicketInput[]>([]);
    const [eventsTotal, setEventsTotal] = useState<number>(0);

    const { t } = useTranslation();

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('loggedInUser')));
    }, []);

    useEffect(() => {
        if (loggedUser?.email) {
            getInvitesByUserEmail(loggedUser.email);
            getTicketsByUserEmail(loggedUser.email);
        }
    }, [loggedUser]);

    const getInvitesByUserEmail = async (email: string) => {
        const response = await InviteService.getInvitesByUserEmail(email);
        const invitesData = await response.json();
        setInvites(invitesData);
    };

    const getTicketsByUserEmail = async (email: string) => {
        const response = await TicketService.getTicketsByUserEmail(email);
        const ticketsData = await response.json();
        setTickets(ticketsData);
    }

    // Handle log out
    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedUser(null);
    }

    // To show user's current page
    const router = useRouter();
    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <header className="p-3 bg-black">
            <a className="fs-1 d-flex justify-content-center mb-2 mb-lg-0 text-white text-decoration-none">
                {' '}
                {t("app.title")}
            </a>
            <nav className="nav justify-content-center">
                <Link href="/" className={`nav-link px-4 fs-5 ${isActive('/') ? 'text-white' : 'text-white-50'}`}>
                    {t("header.home")}
                </Link>

                {loggedUser && loggedUser.role !== 'ADMIN' && (
                    <Link href="/my-invites" className={`nav-link px-4 fs-5 ${isActive('/my-invites') ? 'text-white' : 'text-white-50'}`}>
                        {t("header.myInvites")} {invites && (
                            <span className="badge bg-danger">{invites.filter(invite => invite.status === 'PENDING').length}</span>
                        )}
                    </Link>
                )}

                <Link href="/upcoming-events" className={`nav-link px-4 fs-5 ${isActive('/upcoming-events') ? 'text-white' : 'text-white-50'}`}>
                    {t("header.upcomingEvents")}
                </Link>

                {loggedUser && (loggedUser.role === 'ADMIN' || loggedUser.role === 'ORGANIZER') && (
                    <Link href="/create-event" className={`nav-link px-4 fs-5 ${isActive('/create-event') ? 'text-white' : 'text-white-50'}`}>
                        {t("header.createEvent")}
                    </Link>
                )}

                {loggedUser && loggedUser.role !== 'ADMIN' && (
                    <Link href="/my-events" className={`nav-link px-4 fs-5 ${isActive('/my-events') ? 'text-white' : 'text-white-50'}`}>
                        {t("header.myEvents")} {tickets && invites && (
                            <span className="badge bg-danger">{tickets.length + invites.filter(invite => invite.status === 'ACCEPT').length}</span>
                        )}
                    </Link>
                )}

                {loggedUser ? (
                    <>
                        {loggedUser.role === 'ADMIN' && (
                            <>
                                <Link
                                    href="/users"
                                    className={`nav-link px-4 fs-5 ${isActive('/users') ? 'text-white' : 'text-white-50'}`}
                                >
                                    {t("header.usersOverview")}
                                </Link>

                                <Link
                                    href="/invites-overview"
                                    className={`nav-link px-4 fs-5 ${isActive('/invites-overview') ? 'text-white' : 'text-white-50'}`}
                                >
                                    {t("header.invitesOverview")}
                                </Link>
                            </>
                        )}

                        <Link
                            href="/login"
                            className="nav-link px-4 fs-5 text-white-50"
                            onClick={handleLogout}
                        >
                            {t("header.logout")}
                        </Link>
                        <Link href="/" className="nav-link px-4 fs-5 text-white-50">
                            {t("header.welcome")} {loggedUser.name}{t("header.sama")}!
                        </Link>
                    </>
                ) : (
                    <Link href="/login" className={`nav-link px-4 fs-5 ${isActive('/login') ? 'text-white' : 'text-white-50'}`}>
                        {t("header.login")}
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;