import React, { useEffect, useState } from "react";
import { InviteInput } from "types";
import styles from '@styles/home.module.css';
import { useRouter } from "next/router";
import InviteService from "@services/InviteService";

type Props = {
    invites: InviteInput[],
    showEventName: boolean,
    showUserName: boolean,
    showReactButtons: boolean,
    showNotifications: boolean,
    showDownloadButton: boolean,
};

const InviteOverview: React.FC<Props> = ({ invites, showEventName, showUserName, showReactButtons, showNotifications, showDownloadButton }: Props) => {
    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showStatusMessage, setShowStatusMessage] = useState<boolean>(false);
    const [invitesData, setInvitesData] = useState(invites);

    useEffect(() => {

        // [...invites] creates a new array that contains all the elements of the invites array.
        if (invites && invites.length > 0) {
            const sortedInvites = [...invites].sort((a, b) => a.event.name.localeCompare(b.event.name));
            setInvitesData(sortedInvites);
        }
    }, [invites]);

    const showEventDetail = async (eventId: number) => {
        router.push(`/upcoming-events/${eventId}`);
    }

    const handleInviteAnswer = async (inviteId: number, answer: string) => {
        const response = await InviteService.changeInviteStatus(inviteId.toString(), answer);
        if (response.ok) {
            const changedInvite = await response.json();

            if (changedInvite.status == 'ACCEPT') {
                setStatusMessage(`You have accepted the invitation to ${changedInvite.event.name}`);
            }

            if (changedInvite.status == 'DECLINE') {
                setStatusMessage(`You have declined the invitation to ${changedInvite.event.name}`);
            }

            const updatedInvites = invitesData.map(invite => {
                if (invite.id === changedInvite.id) {
                    return changedInvite;
                }
                return invite;
            });

            updatedInvites.sort((a, b) => a.event.name.localeCompare(b.event.name));
            setInvitesData(updatedInvites);

        } else {
            setStatusMessage("Unexpected error happened.");
        }

        setShowStatusMessage(true);

        setTimeout(() => {
            setShowStatusMessage(false);
        }, 4000);
    }

    const downloadCSV = async () => {
        const headers = ['Event name', 'User name', 'Status'];
        const rows = invitesData.map(invite => [invite.event.name, invite.user.name, invite.status]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "invites_list.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
    }

    return (
        <>
            <section>
                <table className={styles.invitesTable}>
                    <thead>
                        <tr>
                            {showEventName && <th className={styles.invitesTableth1}>Event</th>}
                            {!showEventName ? (
                                showUserName && <th className={styles.invitesTableth1}>User</th>
                            ) : (showUserName && <th>Participant</th>)}
                            <th className={styles.invitesTableth2}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitesData && invitesData.length > 0 ? (
                            invitesData.map((invite, index) => (
                                <tr
                                    key={index}
                                    onClick={() => showEventDetail(invite.event.id)}
                                    className={styles.invitesTableRows}
                                >
                                    {showEventName && <td>{invite.event.name}</td>}
                                    {showUserName && <td>{invite.user.name}</td>}
                                    {showReactButtons ? (
                                        <td className={styles.inviteReact}>
                                            <div className={styles.inviteReactStatus}>{invite.status}</div>
                                            {invite.status === 'PENDING' && (
                                                <div className={styles.inviteReactButtons}>
                                                    <button
                                                        className={styles.acceptButton}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInviteAnswer(invite.id, 'ACCEPT');
                                                        }}
                                                    >Accept
                                                    </button>

                                                    <button
                                                        className={styles.declineButton}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInviteAnswer(invite.id, 'DECLINE');
                                                        }}
                                                    >Decline
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    ) : (<td>{invite.status}</td>)}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3}>No invites yet...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {showStatusMessage && (
                    <p className={styles.inviteStatusMessage}>{statusMessage}</p>
                )}
                {showNotifications && (
                    <div className={styles.inviteComponentNotifications}>
                        <img src="/icons/description.png" alt="Description icon" width="40px" height="40px" />
                        <p>Ticket purchasing is not necessary on invitations.</p>
                    </div>
                )}
                {showDownloadButton && (
                    <div className={styles.downloadButtonHolder}>
                        <button
                            onClick={downloadCSV}
                            className={styles.downloadButton}>
                            Download Invites List
                        </button>
                    </div>
                )}
            </section>
        </>
    )
};

export default InviteOverview;