import supertest from "supertest";
import config from "./config.js";

const request = supertest(config.url);
const generateToken = async (payload = config.credentials) => {
    return await request
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(payload);
};

const deleteUser = async (userId, token) => {
    return await request
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
}

const createUser = async (token) => {
    return await request
        .post('/users/add')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
            firstName: 'Aleksandriia',
            lastName: 'Parkhomenko',
            username: 'Something',
            password: 'Test!123'
        });
}


export { request, generateToken, deleteUser, createUser };

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

