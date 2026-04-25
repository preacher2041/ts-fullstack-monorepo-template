import {test, expect} from '@playwright/test';

const testUser = {
	email: `e2e-test-user-${Date.now()}@example.com`,
	password: 'password123',
	username: `e2e-test-user-${Date.now()}`,
	firstName: 'Test',
	lastName: 'User',
	dob: '01/01/1990',
}

test.describe.configure({ mode: 'serial' });

test.describe('Authentication', () => {
	test('should register a new user', async ({page}) => {
		await page.goto('/registration');
		await page.getByLabel('First Name').fill(testUser.firstName);
		await page.getByLabel('Last Name').fill(testUser.lastName);
		await page.getByLabel('Email').fill(testUser.email);
		const dobField = page.getByLabel('Date of birth');
		await dobField.click();
		await dobField.pressSequentially('01011990');
		await page.getByLabel('Username').fill(testUser.username);
		await page.getByLabel('Password',  { exact: true }).fill(testUser.password);
		await page.getByRole('button', {name: 'Register'}).click();

		await expect(page).toHaveURL('/login');
	})

	test('should login with the registered user', async ({page}) => {
		await page.goto('/login');
		await page.getByLabel('Email').fill(testUser.email);
		await page.getByLabel('Password',  { exact: true }).fill(testUser.password);
		await page.getByRole('button', {name: 'Login'}).click();

		await expect(page.getByText(`Welcome ${testUser.username}`)).toBeVisible();
		await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();
	})

	test('should logout the user', async ({page}) => {
		await page.goto('/login');
		await page.getByLabel('Email').fill(testUser.email);
		await page.getByLabel('Password',  { exact: true }).fill(testUser.password);
		await page.getByRole('button', {name: 'Login'}).click();

		await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();

		await page.getByRole('button', {name: 'Logout'}).click();

		await expect(page.getByRole('link', {name: 'Register'})).toBeVisible();
		await expect(page.getByRole('link', {name: 'Login'})).toBeVisible();
	})
})