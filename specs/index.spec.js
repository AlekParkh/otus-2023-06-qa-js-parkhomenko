import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { login,  createUserAndGetId, getUser, deleteUser } from '../framework/services/user.js';
import config from "../framework/services/config.js";

describe('My group test_2', () => {
    let userId;
    let response;

    beforeAll(async() => {
        console.log('User created and authorized ');
        userId = await createUserAndGetId(config.data[0]);
        response = await login(config.data[0]);
    });

    afterAll(async() => {
        console.log('User deleted');
        const token = response.data.token;
        await deleteUser({userId}, token);
    });

    test('1. Check that user authorized successfully.', async () => {
        expect(response.data.result).toBe('User authorized successfully.');
        expect(response.status).toBe(200);
    });

    test('2. Get user information, ', async () => {
        const token = response.data.token;
        const get = await getUser({userId}, token);
        expect(get.status).toBe(200);
        expect(get.data.userId).toBe(`${userId}`);
    });

    test('3. Get user information with wrong userId, ', async () => {
        const userId = '9705ef2b-147e-48af-a9b5-993018410893';
        const token = response.data.token;
        try {
            await getUser({userId}, token);
            throw new Error('Expected 401 error, but received successful response.');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('User not authorized!');
        }
    });

    test('4. Check that the user is not deleted with an invalid token', async () => {
        const token = '9705ef2b-147e-48af-a9b5-993018410893';
        try {
            await deleteUser({userId}, token);
            throw new Error('Expected 401 error, but received successful response.');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('User not authorized!');
        }
    });

    test('5. Check that the user may removed successfully', async () => {
        const token = response.data.token;
        const resp = await deleteUser({userId}, token);
        expect(resp.status).toBe(204);
    });
})


