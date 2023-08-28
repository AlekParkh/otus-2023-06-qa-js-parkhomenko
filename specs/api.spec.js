import fetch from "node-fetch";
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { createUserAndGetId, deleteUser, login } from '../framework/services/user.js';
import config from "../framework/config.js";


describe('My group test_1', () => {
    let userId;
    let response;

    beforeAll(async() => {
        console.log('User created and authorized ');
        userId = await createUserAndGetId(config.data[1]);
        response = await login(config.data[1]);
    });

    afterAll(async() => {
        console.log('User deleted');
        const token = response.data.token;
        await deleteUser({userId}, token);
    });

    test('1. Positive check: Successful token generation, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        expect(response.status).toBe(200);
        expect(response.data.token).toBeTruthy();
    });

    test('2. Negative check: Failed token creation w/o password, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        try {
            await login({userName: config.data[1].userName});
            throw new Error('Expected 400 error, but received successful response.');
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('UserName and Password required.');
        }
    });

    test('3. Negative check: User creation with invalid password,' +
        'POST: /Account/v1/User', async () => {
        try {
            await createUserAndGetId(config.data[2]);
            throw new Error('Expected 400 error, but received successful response.');
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('Passwords must have at least one non alphanumeric character,' +
                ' one digit (\'0\'-\'9\'), one uppercase (\'A\'-\'Z\'), one lowercase (\'a\'-\'z\'), one special character and Password must be eight characters or longer.');
        }
    });

    test('4. Negative check: Unsuccessful user creation,' +
        'POST: /Account/v1/User', async () => {
        try {
            await createUserAndGetId(config.data[1]);
            throw new Error('Expected 406 error, but received successful response.');
        } catch (error) {
            expect(error.response.status).toBe(406);
            expect(error.response.data.message).toBe('User exists!');
        }
    })
});
    test('Positive check: Update user info', async () => {
        const response = await fetch('https://dummyjson.com/users/14', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: 'Good',
                lastName: 'Day',
            })
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toMatchObject({
            firstName: 'Good',
            lastName: 'Day'
        });
        const fetchedUserResponse = await fetch(`https://dummyjson.com/users/14`);
        const fetchedUserData = await fetchedUserResponse.json();
        expect(fetchedUserResponse.status).toBe(200);
        expect(fetchedUserData).toMatchObject({
            firstName: 'Enoch',
            lastName: 'Lynch',
        });
    })





