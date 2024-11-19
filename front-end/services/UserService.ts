import { UserLogin } from "types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const login = ({email, password}: UserLogin) => {
    return fetch(apiUrl + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password})
    });
};

const UserService = {
    login,
};

export default UserService;