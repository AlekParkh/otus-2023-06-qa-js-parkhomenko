async function loginToSW(page) {
    await page.goto('/login');
    await page.getByPlaceholder('UserName').fill('Alek');
    await page.getByPlaceholder('Password').fill('Test!123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForNavigation();
}

export { loginToSW };
