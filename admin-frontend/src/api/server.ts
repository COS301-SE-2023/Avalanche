import axios from "axios";

const apiConn = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
    },
    withCredentials: true
})

const apiConnJWT = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Authorization": "Bearer <token goes here>"
    },
    withCredentials: true
})

export { apiConn, apiConnJWT };