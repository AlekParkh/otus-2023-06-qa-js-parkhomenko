import { describe, expect, test} from '@jest/globals';
import {generateToken, createUser, deleteUser} from '../framework/services/user.js';

describe('Delete user', () => {
    test('Create and delete user, ' +
        'POST: /users/${userId}', async () => {
        const tokenResponse = await generateToken();
        const token = tokenResponse.body.token;

        const createUserResponse = await createUser(token);
        const userId = createUserResponse.body.id;

       const deleteResponse = await deleteUser(userId, token);

       expect(deleteResponse.status).toBe(404);
       expect(deleteResponse.body).toHaveProperty('message', 'User with id \'101\' not found');
    });
    test('Delete existing user, ' +
        'POST: /users/${userId}', async () => {
        const userId = 14;
        const deleteResponse = await deleteUser(userId);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.isDeleted).toBeTruthy();

    });
    })
