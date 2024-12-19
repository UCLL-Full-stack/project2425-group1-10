import { EventInput } from "@types";
import styles from '@styles/home.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventService from "@services/EventService";
import UserService from "@services/UserService";

type Props = {
  events: EventInput[],
  showDeleteButton: boolean,
  showLikeButton: boolean,
  email: string,
};

const EventOverview: React.FC<Props> = ({ events, showDeleteButton, showLikeButton, email }: Props) => {
  const router = useRouter();
  const [user, setUsers] = useState<UserInput[]>();
  const [showTickets, setShowTickets] = useState<boolean>(false);
  const [successfullyAddedEventToMyFavorites, setSuccessfullyAddedEventToMyFavorites] = useState<string>("");
  const [emailData, setEmailData] = useState<string>(email);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const user = loggedInUser ? JSON.parse(loggedInUser) : null;

    if (user) {
      setEmailData(user.email);
    }
}, []);

  const handleEventClick = (eventId: number) => {
    sessionStorage.setItem('eventId', eventId.toString());
    router.push(`/upcoming-events/${eventId}`);
  };

  // Renew the events list when an event is removed
  const [myEvents, setMyEvents] = useState(events);

  const removeEvent = async (eventId: number) => {
    await EventService.removeFromMyEvents(email, eventId);

    // Renew the events list when an event is removed
    setMyEvents(myEvents.filter(event => event.id !== eventId));
  }

  const addEventToFavorite = async (eventId: number, name: string) => {
    const response = await UserService.addEventToFavorite(emailData, eventId);

    if (response.ok) {
      alert(`Event ${name} has been added to your favorite list!`);
    }
  }

  return (
    <>
      <section className={styles.holder}>
        {myEvents && myEvents.length > 0 ? (
          <div className={styles.events}>
            {myEvents.map((event, index) => (
              <div
                key={index}
                className={styles.event}
                style={{ backgroundImage: `url(${event.backgroundImage})` }}
                onClick={() => handleEventClick(event.id)}
                role="button"
              >
                <div className={styles.overlay}></div>
                <h3>{event.name}</h3>
                <p className={styles.desc}>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                {/* <p className={styles.hiddenOb}>{event.location}</p>
                <p className={styles.hiddenOb}>{event.category}</p> */}

                <div>
                  {showDeleteButton === true &&
                    <button
                      className={styles.removeButton}
                      onClick={(e) => {
                        // Instead of triggering handleEventClick, it should trigger removeEvent
                        e.stopPropagation();
                        removeEvent(event.id);
                      }}
                    ><img src="/icons/close-white.png" alt="Close icon" width="40px" height="40px" />
                    </button>
                  }
                  {showLikeButton === true && emailData !== "" &&
                    <div className={styles.addToMyFavorite}>
                      <button
                        className={styles.addToMyFavoriteButton}
                        onClick={(e) => {
                          // Instead of triggering handleEventClick, it should trigger removeEvent
                          e.stopPropagation();
                          addEventToFavorite(event.id, event.name);
                        }}
                      ><img src="/icons/add-white.png" alt="Add icon" width="40px" height="40px" />
                      </button>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">There are no upcoming events...</p>
        )}
      </section>
    </>
  )
};

export default EventOverview;