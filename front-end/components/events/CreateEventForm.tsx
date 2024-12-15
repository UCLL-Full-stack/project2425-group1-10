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
        return true; //A: In case of name if its not empty or there is a mail u will get true.
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        clearErrors(); //A: This will clear all the errors

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
};

export default CreateEventForm;
