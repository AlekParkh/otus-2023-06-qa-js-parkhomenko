import { describe, expect, test, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { login,  createUserAndGetId, getUser, deleteUser } from '../framework/services/user.js';
import { addBook, updateBook, getBook, deleteBook } from "../framework/services/book.js";
import config from "../framework/config.js";

describe('User Suit', () => {
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


describe('Book Suit', () => {
    let userId;
    let response;

    beforeEach(async () => {
        console.log('User created and authorized ');
        userId = await createUserAndGetId(config.data[0]);
        response = await login(config.data[0]);
        const token = response.data.token;
        const bookData = {
            isbn: "9781491904244"
        };
        await addBook({userId}, token, bookData);
    });

    afterEach(async () => {
        console.log('User deleted');
        const token = response.data.token;
        await deleteUser({userId}, token);
    });

    test('1. Add existing book to user.', async () => {
        const token = response.data.token;
        const bookData = {
            isbn: "9781449325862"
        };
        const resp = await addBook({userId}, token, bookData);
        expect(resp.status).toBe(201);
        expect(resp.data.books).toStrictEqual([{"isbn": "9781449325862"}]);
        const get = await getUser({userId}, token);
        expect(get.data.books[0].isbn).toBe('9781491904244');
        expect(get.data.books[1].isbn).toBe('9781449325862');

    });

    test('2. Add non-existing book to user.', async () => {
        const token = response.data.token;
        const bookData = {
            isbn: "123"
        };
        try {
            await addBook({userId}, token, bookData);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toBe('ISBN supplied is not available in Books Collection!');
        }
    });

    test('3. Update book for user.', async () => {
        const token = response.data.token;
        const bookData = {
            isbn: "9781449325862"
        };
        const resp = await addBook({userId}, token, bookData);
        expect(resp.status).toBe(201);

        const addedBookISBN = bookData.isbn;
        const newIsbn = "9781593277574";
        const updateData = {
            userId: userId,
            isbn: newIsbn
        };
        const updateResp = await updateBook(addedBookISBN, updateData, token);
        expect(updateResp.status).toBe(200);
        const get = await getUser({userId}, token);
        expect(get.data.books[0].isbn).toBe('9781491904244');
        expect(get.data.books[1].isbn).toBe('9781593277574');
    });

    test('4.Delete book', async () => {
            const token = response.data.token;
            const resp = await deleteBook({userId}, {isbn: '9781491904244'}, token);
            expect(resp.status).toBe(204);
            const get = await getUser({userId}, token);
            expect(get.data.books).toEqual([]);
        });
})

    describe('Get book', () => {

        test('1. Get book info with exist isbn', async () => {
            const isbn = '9781593277574'
            const response = await getBook({isbn});
            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                "isbn": "9781593277574",
                "title": "Understanding ECMAScript 6",
                "subTitle": "The Definitive Guide for JavaScript Developers",
                "author": "Nicholas C. Zakas",
                "publish_date": "2016-09-03T00:00:00.000Z",
                "publisher": "No Starch Press",
                "pages": 352,
                "description": "ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that E",
                "website": "https://leanpub.com/understandinges6/read"
            });
        });

        test('2. Get book info with non-existing isbn', async () => {
            const isbn = '123'
            try {
                await getBook({isbn});
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.message).toBe('ISBN supplied is not available in Books Collection!');
            }
        });
    })


