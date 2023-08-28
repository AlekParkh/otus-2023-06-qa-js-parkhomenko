import config from "../config.js";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: config.url,
});
const createUserAndGetId = async ({ userName, password }) => {
    const response = await axiosInstance({
        method: 'POST',
        url: '/Account/v1/User',
        data: {
            userName: userName,
            password: password
        },
    })

    return response.data.userID;
}
const login = async ({ userName, password }) => {
    const response = await axiosInstance({
        method: 'POST',
        url: '/Account/v1/GenerateToken',
        data: {
            userName: userName,
            password: password
        }
    })
    return response;
}
const getUser = async ({userId}, token) => {
    const response = await axiosInstance({
        method: 'GET',
        url: `/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
    })
    return response;
}
const deleteUser = async ({userId}, token) => {
    const response = await axiosInstance({
        method: 'DELETE',
        url: `/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
    })
    return response;
}


export { login,  createUserAndGetId, getUser, deleteUser };

export async function createUserWithMoc(userData) {
    const response = await fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.error === 'User already exists') {
        throw new Error('User already exists');
    }
    return data;
}


