import fetch from "node-fetch";
import {describe, expect, test} from '@jest/globals';
import {createUser} from './helper.js';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
describe('Generate token', () => {
    test('Positive check: Successful token generation, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'kminchelle',
                password: '0lelplR',
            })
        })
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.token).toBeTruthy();
    })

    test('Negative check: Failed token creation w/ password, ' +
        'POST: /Account/v1/GenerateToken', async () => {
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'kminchelle',
            })
        })
        const data = await response.json();
        expect(response.status).toBe(400);
        expect(data).toHaveProperty('message', 'Invalid credentials');
    })
})

describe('Create user', () => {
    test('Positive check: User creation successful,' +
        'POST: /Account/v1/User', async () => {
        const response = await fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: 'Aleksandriia',
                lastName: 'Parkhomenko',
                username: 'Something',
                password: 'Test!123'
            })
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data).toMatchObject({
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
            await createUser(userData);
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




