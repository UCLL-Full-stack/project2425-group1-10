import { UserInput } from "types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAll = async () => {
    const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

    return fetch(apiUrl + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
}

const createUser = async (user: UserInput) => {
    return fetch(apiUrl + '/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user), //A: converts JS object in json-formatted string.
    });
}

const loginUser = async (user: UserInput) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
}

const UserService = {
    getAll,
    createUser,
    loginUser,
}

export default UserService;