<<<<<<< HEAD
import React, { useState } from "react";
import styles from '@styles/home.module.css';
import { StatusMessage } from "types";
import { useRouter } from "next/router";
import EventService from "@services/EventService";
import classNames from "classnames";
import { stat } from "fs";
import TicketService from "@services/TicketService";

const CreateEventForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState<string>("");  //A: the usestate basically declares that name should only store strings.
    const [description, setDescription] = useState<string>(""); //A: setErrorMessage: is the function we are gonna use to update errorMessage.
    const [date, setDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [backgroundImage, setBackgroundImage] = useState<string>("");//A: lege string als start
    const [isTrending, setIsTrending] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(""); //A: The ("") means the initial value of the SV is an empty string.
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]); //A: for general status messages (error or succes)

    //A: The first statusMessages will store the data. The <StatusMessage[]> indicates that it should be an array of objects of type statusMessage and it is findable in another part of the project. It starts empty but can be modified with the set... .
    const [showSuccessIcon, setShowSuccessIcon] = useState<boolean>(false);

    //A: for the tickets:
    const [ticketAmount, setTicketAmount] = useState<number | null>(null);
    const [ticketType, setTicketType] = useState<string>(); //A: Array to store ticket types for each ticket => array cause u can have multiple tickets.
    const [ticketPrice, setTicketPrice] = useState<number>();//A: undefined als start.

    const clearErrors = () => {
        setErrorMessage("");
        setStatusMessages([]);
    };

    const validate = (): boolean => {
        if (!name || name.trim() === "") { //A: name is mandatory and can't be empty.
            setErrorMessage("Name is required and can not be empty.");
            return false; //A: If name is empty it will turn false.
        };
        if (!description || description.trim() === "") {
            setErrorMessage("Description is required and can not be empty.");
            return false;
        };
        if (!date) {
            setErrorMessage("Date is required.");
        };
        if (!location || location.trim() === "") {
            setErrorMessage("Location is required and can not be empty");
        };
        if (!backgroundImage || backgroundImage.trim() === "") {
            setErrorMessage("Location is required and can not be empty");
        }
        if (!category || category.trim() === "") {
            setErrorMessage("Category is required and can not be empty");
        };
        if (!isTrending) {
            setErrorMessage("Trending status must be enabled.");
            return false;
        }
        if (ticketAmount === null || ticketAmount < 1 || ticketAmount > 5) {
            setErrorMessage("Ticket amount is required and must be between 1 and 5.");
            return false;
        }
        if (!ticketType) {
            setErrorMessage("Ticket type is required.")
            return false;
        }
        if (ticketPrice) {
            setErrorMessage("Ticket price is required.")
            return false;
        }
        return true; //A: In case of name if its not empty or there is a mail u will get true.
    };
    //A: Handles form submission to create a new event.
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        clearErrors(); //A: This will clear all the errors before going further.

        const event = { name, description, date, location, category, backgroundImage, isTrending };
        
        const ticket = {type, cost, user, event:event.id};
        const response = await EventService.createEvent(event);
        for(let i = 0; i < ticketAmount; i++){ //A: afhangend van de hoeveelheid tickets gaat het zoveel tickets creëeren
            const response2 = await TicketService.createTicket(ticket);
        }

        //A: To check if things are working correctly thus far:
        console.log(response.status);

        if (response.status === 200) {
            setShowSuccessIcon(true);
        

            const event = await response.json();
            localStorage.setItem("createdEvent",
                JSON.stringify({
                    token: event.token,
                    name: event.name,
                    description: event.description,
                    date: event.date,
                    location: event.location,
                    category: event.category,
                    backgroundImage: event.backgroundImage,
                    isTrending: event.isTrending,
                })
            );
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } else if (response.status === 401) {
            const responseBody = await response.json();
            console.log(responseBody); //A: check to see how its working

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

    return (
        <>
            <form onSubmit={handleFormSubmit} className={styles.createEventForm}>
                {statusMessages && (  //A: Displays status messages if they exist.
                    <div className="row">
                        <ul>
                            {statusMessages.map(({ message, type }, index) => (
                                <li key={index} className={styles.eventStatusMessage}>
                                    <img src="/icons/close-red.png" alt="error" width="40px" height="40px" />
                                    <p>{message}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showSuccessIcon && (  //A: Displays success icon if `showSuccessIcon` is true.
                    <img src="/icons/check-green.png" alt="success" width="40px" height="40px" className={styles.eventSuccessIcon} />
                )}

                <label htmlFor="name">Event Name</label>
                <input
                    type="text"
                    id="name"
                    placeholder='example: Taylor Swift'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    placeholder='example: This concert will give you the best songs of Taylor Swift.'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    onChange={(e) => setDate(new Date(e.target.value))}  //A: Converts input to Date object.
                />

                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    id="location"
                    placeholder='example: Vorst National Brussels'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <label htmlFor="category">Category</label>
                <input
                    type="text"
                    id="category"
                    placeholder='example: Concert'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <label htmlFor="backgroundImage">Background Image URL</label>
                <input
                    type="text"
                    id="backgroundImage"
                    placeholder='example: https://www.nytimes.com'
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                />

                <label htmlFor="isTrending">Trending</label>
                <input
                    type="checkbox"
                    id="isTrending"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                />

                <label htmlFor="ticketAmount">Ticket amount</label>
                <select

                    name="ticketAmount"
                    id="ticketAmount"
                    value={ticketAmount || ""} //A: starts empty
                    onChange={(e) => {
                        setTicketAmount(Number(e.target.value)); // Reset ticket types when ticket amount changes
                    }}

                >
                    <option value="" disabled selected hidden>Select ticket amount</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>


                {/* < input
                    type="number"
                    name="ticketAmount"
                    min="0"
                    max="5"
                    placeholder="0-5"
                    value={ticketAmount || ""}
                    onChange={(e) => {
                        const amount = e.target.value ? parseInt(e.target.value) : 0;
                        setTicketAmount(amount);
                        // Reset ticket types when ticket amount changes
                    }}
                /> */}

                {/*A: Dit deel gaat er voor zorgen dat je het aantal keer van de tickets kan zien*/}
                {ticketAmount && (
                    // Zorg ervoor dat ticketAmount wordt gebruikt om een lege array te maken
                    <div className={styles.ticketPriceAndTypeStyling}>
                        <div>
                            <label htmlFor={`ticketType`}>Ticket type</label>
                            <select
                                name={`ticketTypE`}
                                id={`ticketType`}
                                onChange={(e) => setTicketType(e.target.value)}
                            >
                                <option value="" disabled hidden>No ticket selected</option>
                                <option value="Normal">Normal</option>
                                <option value="VIP">VIP</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`ticketPrice`}>Ticket price </label>
                            <input
                                type="number"
                                id={`ticketPrice`}
                                name={`ticketPrice`}
                                placeholder={`Price for ticket`}
                                onChange={(e) => setTicketPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>
                )}


                {/* <label htmlFor="ticketType">Ticket type:</label>
                <select
                    name= "ticketType"
                    id= "ticketType"
                    // placeholder="select" doesn't work with select.
                    value= {ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                >
                    <option value="" disabled selected hidden>No ticket selected</option>
                    <option value="Normal">Normal</option>
                    <option value="VIP">VIP</option>

                </select> */}

                <div className={styles.myEventsLoginSignupButtons}>
                    <button
                        type="submit"
                        className={styles.createEventButton}
                    >
                        Create Event
                    </button>
                </div>

                {errorMessage && (  //A: Displays error message if it exists.
                    <p className={styles.eventErrorMessage}>{errorMessage}</p>
                )}
            </form>
        </>
    );
};

export default CreateEventForm;
=======
import EventService from '@services/EventService';
import TicketService from '@services/TicketService';
import styles from '@styles/home.module.css';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CreateEventForm: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date>(null);
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [ticketAmount, setTicketAmount] = useState<number>();
    const [ticketType, setTicketType] = useState('');
    const [ticketPrice, setTicketPrice] = useState<number>();

    // Errors
    const [eventNameError, setEventNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [dateError, setDateError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [ticketAmountError, setTicketAmountError] = useState('');
    const [ticketTypeError, setTicketTypeError] = useState('');
    const [ticketPriceError, setTicketPriceError] = useState('');

    // Status
    const [status, setStatus] = useState('');

    const router = useRouter();

    const validateForm = (): boolean => {
        if (!eventName || eventName.trim() === '') {
            setEventNameError('Event name is required.');
            return false;
        }
        if (!description || description.trim() === '') {
            setDescriptionError('Description is required.');
            return false;
        }
        if (!date) {
            setDateError('Date is required.');
            return false;
        }
        if (!location || location.trim() === '') {
            setLocationError('Location is required.');
            return false;
        }
        if (!category || category.trim() === '') {
            setCategoryError('Category is required.');
            return false;
        }
        if (!ticketAmount) {
            setTicketAmountError('Ticket amount is required.');
            return false;
        }
        if (!ticketType || ticketType.trim() === '') {
            setTicketTypeError('Ticket type is required.');
            return false;
        }
        if (!ticketPrice) {
            setTicketPriceError('Ticket price is required.');
            return false;
        }

        return true;
    }

    const handleCreateEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEventNameError('');
        setDescriptionError('');
        setDateError('');
        setLocationError('');
        setCategoryError('');
        setTicketAmountError('');
        setTicketTypeError('');
        setTicketPriceError('');

        if (validateForm()) {
            const eventData = {name: eventName, description: description, date: date, location: location, category: category, isTrending: false};

            const response = await EventService.createEvent(eventData);
            const createdEvent = await response.json();

            for (let i = 0; i < ticketAmount; i++) {
                await TicketService.createTicket(ticketType, ticketPrice, createdEvent);
            }

            setStatus('Event and its tickets were created successfully. Redirecting to upcoming events page...');

            setTimeout(() => {
                router.push('/upcoming-events');
            }, 3000);
        }
    };

    return (
        <>
            <form
                className={styles.createEventForm}
                onSubmit={handleCreateEventSubmit}
            >
                <div className={styles.createEventFormContainer}>
                    <div className={styles.createEventFormContainerEvent}>
                        <p className={styles.createEventFormContainerTitles}>Creating event</p>
                        <div>
                            <label
                                htmlFor="name">Event name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={(e) => setEventName(e.target.value)}
                                 />
                            {eventNameError !== '' && <p className={styles.loginErrorMessage}>{eventNameError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor="description">Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                onChange={(e) => setDescription(e.target.value)}
                                 />
                            {descriptionError !== '' && <p className={styles.loginErrorMessage}>{descriptionError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor="date">
                                Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                onChange={(e) => setDate(new Date(e.target.value))}
                                 />
                            {dateError !== '' && <p className={styles.loginErrorMessage}>{dateError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor="location">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                onChange={(e) => setLocation(e.target.value)}
                                 />
                            {locationError !== '' && <p className={styles.loginErrorMessage}>{locationError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor="category">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                onChange={(e) => setCategory(e.target.value)}
                                 />
                            {categoryError !== '' && <p className={styles.loginErrorMessage}>{categoryError}</p>}
                        </div>
                    </div>
                    <div className={styles.createEventFormContainerTicket}>
                        <p className={styles.createEventFormContainerTitles}>Creating tickets for this event</p>
                        <div>
                            <label
                                htmlFor='ticketAmount'>
                                Ticket amount
                            </label>
                            <select
                                id="ticketAmount"
                                className='ticketAmount'
                                onChange={(e) => setTicketAmount(parseInt(e.target.value))}
                            >
                                <option value="">Select the number of tickets (maximum 5)</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            {ticketAmountError !== '' && <p className={styles.loginErrorMessage}>{ticketAmountError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor='ticketType'>
                                Ticket type
                            </label>
                            <select
                                id="ticketType"
                                className='ticketType'
                                onChange={(e) => setTicketType(e.target.value)}
                            >
                                <option value="">Select ticket type</option>
                                <option value="VIP">VIP</option>
                                <option value="REGULAR">REGULAR</option>
                                <option value="FREE">FREE</option>
                                <option value="STUDENT">STUDENT</option>
                            </select>
                            {ticketTypeError !== '' && <p className={styles.loginErrorMessage}>{ticketTypeError}</p>}
                        </div>
                        <div>
                            <label
                                htmlFor='ticketPrice'>
                                Ticket price
                            </label>
                            <input
                                type='number'
                                id='ticketPrice'
                                name='ticketPrice'
                                onChange={(e) => setTicketPrice(parseInt(e.target.value))}
                                 />
                            {ticketPriceError !== '' && <p className={styles.loginErrorMessage}>{ticketPriceError}</p>}
                        </div>
                    </div>
                </div>
                <button type="submit">Create event</button>
                {status !== '' && <p className={styles.loginSuccessMessage}>{status}</p>}
            </form>
        </>
    )
};

export default CreateEventForm;
>>>>>>> origin/Development
