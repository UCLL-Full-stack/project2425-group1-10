import React from 'react';
import { EventInput } from '@types';
import styles from '@styles/home.module.css';

type Props = {
    event: EventInput;
};

const EventDetails: React.FC<Props> = ({event}: Props) => {

    if (!event) {
        return <p>Loading...</p>;
    };

    console.log(event);

    return (
        <>
            <h2>Event name: {event.name}</h2>
            <p>Description: {event.description}</p>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Category: {event.category}</p>
            {event.participants && event.participants.length > 0 && (
                <div className={styles.participants}>
                    <h2>Participants</h2>
                    <table className={styles.participantsTable}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.participants.map((participant, index) => (
                                <tr key={index}>
                                    <td>{participant.user.username}</td>
                                    <td>{participant.user.name}</td>
                                    <td>{participant.user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
};

export default EventDetails;