import React, { useState } from "react";
import styles from '@styles/home.module.css';
import { StatusMessage } from "types";
import { useRouter } from "next/router";
import EventService from "@services/EventService";
import classNames from "classnames";
import { stat } from "fs";

const CreateEventForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState<string>("");  //A: the usestate basically declares that name should only store strings.
    const [description, setDescription] = useState<string>(""); //A: setErrorMessage: is the function we are gonna use to update errorMessage.
    const [date, setDate] = useState<Date | null>(null);
    const [location, setLocation] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [backgroundImage, setBackgroundImage] = useState<string>("");
    const [isTrending, setIsTrending] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(""); //A: The ("") means the initial value of the SV is an empty string.
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]); //A: for general status messages (error or succes)
    //A: The first statusMessages will store the data. The <StatusMessage[]> indicates that it should be an array of objects of type statusMessage and it is findable in another part of the project. It starts empty but can be modified with the set... .
    const [showSuccessIcon, setShowSuccessIcon] = useState<boolean>(false);

    //A: for the tickets:
    const [ticketAmount, setTicketAmount] = useState<number | null>(null);
    const [ticketType, setTicketType] = useState<string[]>([]); //A: Array to store ticket types for each ticket => array cause u can have multiple tickets.


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
        const response = await EventService.createEvent(event);


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
    const handleTicketTypeChange = (index: number, value: string) => {
        const newTicketTypes = [...ticketType]; //A: Deze regel maakt een kopie van de ticketType array, omdat in react het niet echt een goed idee is om arrays direct te muteren.
        newTicketTypes[index] = value; //A: als we bv 4 tickets( index = 4 ) hebben is het zoals dit: ticketType = ["", "", "", ""]; Lege waarden voor elk van de 4 tickets.
        setTicketType(newTicketTypes);
    };

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

                <label htmlFor="name">Event Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder='example: Taylor Swift'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    placeholder='example: This concert will give you the best songs of Taylor Swift.'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    onChange={(e) => setDate(new Date(e.target.value))}  //A: Converts input to Date object.
                />

                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    placeholder='example: Vorst National Brussels'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <label htmlFor="category">Category:</label>
                <input
                    type="text"
                    id="category"
                    placeholder='example: Concert'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <label htmlFor="backgroundImage">Background Image URL:</label>
                <input
                    type="text"
                    id="backgroundImage"
                    placeholder='example: https://www.nytimes.com'
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                />

                <label htmlFor="isTrending">Trending:</label>
                <input
                    type="checkbox"
                    id="isTrending"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                />



                <label htmlFor="ticketAmount">Ticket amount:</label>
                <select
                    name="ticketAmount"
                    id="ticketAmount"
                    value={ticketAmount || ""} //A: starts empty
                    onChange={(e) => {
                        const amount = e.target.value ? parseInt(e.target.value) : 0;
                        setTicketAmount(amount);
                        setTicketType(Array(amount).fill('')); // Reset ticket types when ticket amount changes
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
                {/*
                < input
                    type="number"
                    name="ticketAmount"
                    min="0"
                    max="5"
                    placeholder="0-5"
                    value={ticketAmount || ""}
                    onChange={(e) => {
                        const amount = e.target.value ? parseInt(e.target.value) : 0;
                        setTicketAmount(amount);
                        setTicketType(Array(amount).fill('')); // Reset ticket types when ticket amount changes
                    }}
                /> */}

                {/*A: Dit deel gaat er voor zorgen dat je het aantal keer van de tickets kan zien*/}
                {ticketAmount && ticketAmount > 0 && [...Array(ticketAmount)].map((_, index) => (
                    <div key={index}>
                        <label htmlFor={`ticketType-${index}`}>Ticket type {index + 1}:</label>
                        <select
                            name={`ticketType-${index}`}
                            id={`ticketType-${index}`}
                            value={ticketType[index] || ''}
                            onChange={(e) => handleTicketTypeChange(index, e.target.value)}
                        >
                            <option value="" disabled hidden>No ticket selected</option>
                            <option value="Normal">Normal</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                ))}
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
