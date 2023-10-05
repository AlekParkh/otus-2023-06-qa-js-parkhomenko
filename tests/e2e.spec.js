import { test, expect } from '@playwright/test';
import { loginToSW, log, handleAlertDialog, getBookData } from '../framework/services/e2e.js';
import { deleteBook } from "../framework/services/book.js";
import { login } from '../framework/services/user.js';
import config from "../framework/config.js";

test.describe('something', () => {
    test.beforeEach(async ({page}) => {
        await loginToSW(page);
    })

test('Success Login to SW', async ({ page }) => {
    await log ('Step 1. Login to SW and check buttons is active');
    await expect(page.getByRole('button', {name: 'Log out'})).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Go To Book Store' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Delete All Books' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Delete Account' })).toBeEnabled();
});

test('Check alert "Book added to your collection."', async ({ page }) => {
    await log ('Step 1. Add book to collection and check alert message');
    await page.goto('/books?book=9781449365035');
    await page.getByRole('button', { name: 'Add To Your Collection' }).click();
    await handleAlertDialog(page, 'Book added to your collection.');

    const response = await login(config.data[3]);
    const token = response.data.token;
    await deleteBook({userId: '1ad33aed-535a-4555-aa4d-d78e4f3c583b'}, {isbn: '9781449365035'}, token);
});

test('Check that book was added successfully', async ({ page }) => {
    await log ('Step 1. Add book to collection');
    await page.goto('/books?book=9781449365035');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: 'Add To Your Collection' }).click();
    await handleAlertDialog(page, 'Book added to your collection.');

    await log ('Step 2. Try to add book one more time and check alert message');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: 'Add To Your Collection' }).click();
    await handleAlertDialog(page, 'Book already present in the your collection!');

    await log ('Step 3. Go to Profile and check that book in the list');
    await page.getByText('Profile').click();
    const link = await page.getByRole('link', { name: 'Speaking JavaScript' });
    await expect(link).toHaveText('Speaking JavaScript');

    await log ('Step 4. Re-login to SW, click on the link and check ISBN and Title');
    await page.getByRole('button', { name: 'Log out' }).click();
    await loginToSW(page);
    await page.getByRole('link', { name: 'Speaking JavaScript' }).click();
    const actualBook = await getBookData(page);
    const expectedIsbn = '9781449365035';
    const expectedTitle = 'Speaking JavaScript';
    await expect(actualBook.isbn).toContain(expectedIsbn);
    await expect(actualBook.title).toContain(expectedTitle);

    const response = await login(config.data[3]);
    const token = response.data.token;
    await deleteBook({userId: '1ad33aed-535a-4555-aa4d-d78e4f3c583b'}, {isbn: '9781449365035'}, token);
});

test('Check book can be deleted successfully', async ({ page }) => {
    await log ('Step 1. Add book to collection');
    await page.goto('/books?book=9781449365035');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: 'Add To Your Collection' }).click();
    await handleAlertDialog(page, 'Book added to your collection.');

    await log ('Step 2. Go to Profile, click "Delete" and check that book was deleted');
    await page.locator('li').filter({ hasText: 'Profile' }).click();
    await page.getByRole('gridcell', { name: 'Delete' }).locator('path').click();
    await page.getByRole('button', { name: 'OK' }).click();
    await handleAlertDialog(page, 'Book deleted.');
    await expect(page.getByRole('link', { name: 'Speaking JavaScript' })).toBeHidden();
})
})

test('Cannot auth without credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Books : User Name : AlekLog out').isVisible();
    await expect(page.getByPlaceholder('UserName')).toHaveClass(/is\-invalid/);
    await expect(page.getByPlaceholder('Password')).toHaveClass(/is\-invalid/);
});

