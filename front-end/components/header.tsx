import Link from 'next/link';
import { useRouter } from 'next/router';

const Header: React.FC = () => {

    // To show user's current page
    const router = useRouter();
    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <header className="p-3 bg-black">
            <a className="fs-1 d-flex justify-content-center mb-2 mb-lg-0 text-white text-decoration-none">
                {' '}
                Eventora
            </a>
            <nav className="nav justify-content-center">
                <Link href="/" className={`nav-link px-4 fs-5 ${isActive('/') ? 'text-white' : 'text-white-50'}`}>
                Home
                </Link>

                <Link href="/upcoming-events" className={`nav-link px-4 fs-5 ${isActive('/upcoming-events') ? 'text-white' : 'text-white-50'}`}>
                Upcoming events
                </Link>

                <Link href="/my-events" className={`nav-link px-4 fs-5 ${isActive('/my-events') ? 'text-white' : 'text-white-50'}`}>
                My events
                </Link>

                <Link href="/create-event" className={`nav-link px-4 fs-5 ${isActive('/create-event') ? 'text-white' : 'text-white-50'}`}>
                Create event
                </Link>

                <Link href="/login" className={`nav-link px-4 fs-5 ${isActive('/login') ? 'text-white' : 'text-white-50'}`}>
                Login
                </Link>
            </nav>
        </header>
    );
};

export default Header;