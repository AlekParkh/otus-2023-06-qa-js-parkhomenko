import fetch from "node-fetch";
import {describe, expect, test} from '@jest/globals';
import {generateToken, createUser, createUserWithMoc} from '../framework/services/user.js';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
describe('Generate token', () => {
    test('Positive check: Successful token generation, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        const response = await generateToken();

        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
    })

    test('Negative check: Failed token creation w/ password, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        const payload = {
            username: 'kminchelle'
        };
        const response = await generateToken(payload);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    })
})

describe('Create user', () => {
    test('Positive check: User creation successful,' +
        'POST: /Account/v1/User', async () => {
        const tokenResponse = await generateToken();
        const token = tokenResponse.body.token;

        const createUserResponse = await createUser(token);
        expect(createUserResponse.status).toBe(200);
        expect(createUserResponse.body).toMatchObject({
            firstName: 'Aleksandriia',
            lastName: 'Parkhomenko',
            username: 'Something',
            password: 'Test!123',
        });
    })

    test('Negative check: User creation with error,' +
        'POST: /Account/v1/User', async () => {
        fetchMock.mockOnce(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        const userData = {
            firstName: 'Muhammad',
            lastName: 'Ovi',
            age: 250,
        };
        try {
            await createUserWithMoc(userData);
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe('User already exists');
        }
    })
})

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




