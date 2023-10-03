import { expect } from '@playwright/test';
async function loginToSW(page) {
    await page.goto('/login');
    await page.getByPlaceholder('UserName').fill('Alek');
    await page.getByPlaceholder('Password').fill('Test!123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForNavigation();
}

async function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}

async function handleAlertDialog (page, expectedMessage) {
    const dialog = await page.waitForEvent('dialog');
    await expect(dialog.type()).toContain('alert');
    await expect(dialog.message()).toBe(expectedMessage);
    await dialog.accept();
}

async function getBookData(page) {
    const bookElement = await page.locator('#app div').filter({
        hasText: 'ISBN : 9781449365035Title : Speaking JavaScriptSub Title : An In-Depth Guide for' }).nth(3);
    const bookText = await bookElement.textContent();

    const lines = bookText.split('\n');
    const isbn = lines.find(line => line.includes('ISBN')).replace('ISBN : ', '').trim();
    const title = lines.find(line => line.includes('Title')).replace('Title : ', '').trim();

    return { isbn, title };
}

export { loginToSW, log, handleAlertDialog, getBookData };
