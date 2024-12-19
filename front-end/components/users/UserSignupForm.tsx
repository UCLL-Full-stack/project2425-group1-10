import UserService from '@services/UserService';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { use, useState } from 'react';
import { Role } from 'types';

const UserSignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('PARTICIPANT');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showStatus, setShowStatus] = useState(false);

    const router = useRouter();

    const validateForm = (): boolean => {
        setUsernameError('');
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setAgeError('');
        setRoleError('');

        if (!username || username.trim() === '') {
            setUsernameError('Username is required.');
            return false;
        }

        if (!name || name.trim() === '') {
            setNameError('Name is required.');
            return false;
        }

        if (!email || email.trim() === '') {
            setEmailError('Email is required.');
            return false;
        }

        if (!password || password.trim() === '') {
            setPasswordError('Password is required.');
            return false;
        }

        if (!age || age.trim() === '') {
            setAgeError('Age is required.');
            return false;
        }

        if (!role || role.trim() === '') {
            setRoleError('Role is required.');
            return false;
        }

        return true;
    }

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {

            const response = await UserService.createUser({
                username,
                name,
                email,
                password,
                age: parseInt(age),
                role,
            });

            if (response.ok) {
                setStatusMessage('User created successfully! Redirecting...');
                setShowStatus(true);

                setTimeout(() => {
                    router.push('/');
                }, 2000);

            } else {
                setStatusMessage('User creation failed!');
                setShowStatus(true);
            }
        }
    };

    return (
        <>
            <form
                className={styles.userSignupForm}
                onSubmit={handleSignupSubmit}
            >
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder='example: taylor123'
                    onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && <p>{usernameError}</p>}

                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder='example: Taylor Swift'
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && <p>{nameError}</p>}

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder='example: taylor.swift@ucll.be'
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p>{emailError}</p>}

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder='********'
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}

                <label htmlFor="age">Age</label>
                <select
                    name="age"
                    id="age"
                    onChange={(e) => {
                        setAge(e.target.value)
                    }}
                >
                    <option value="">Select your age</option>
                    {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>
                {ageError && <p>{ageError}</p>}

                <label htmlFor="role">Role</label>
                <select
                    name="role"
                    id="role"
                    onChange={(e) => setRole(e.target.value as Role)}
                >
                    <option value="">Select a role</option>
                    <option value="PARTICIPANT">Participant</option>
                    <option value="ORGANIZER">Organizer</option>
                </select>
                {roleError && <p>{roleError}</p>}

                <div className={styles.myEventsLoginSignupButtons}>
                    <button
                        type="submit"
                        className={styles.userSignupButton}
                    >Sign up</button>
                </div>
                {showStatus && <p className={styles.loginSuccessMessage}>{statusMessage}</p>}
            </form>
        </>
    )
};

export default UserSignupForm;