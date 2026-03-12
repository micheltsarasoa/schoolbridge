import { test, expect } from '@playwright/test';

// Function to generate a unique email for each test run
function generateUniqueEmail() {
  const timestamp = new Date().getTime();
  return `testuser-${timestamp}@example.com`;
}

test.describe('User Registration (Email/Password) with OTP', () => {
  // Assuming your application is running at http://localhost:3000
  const BASE_URL = 'http://localhost:3000'; 

  test('should successfully register a new user and redirect to verify-otp page', async ({ page }) => {
    const uniqueEmail = generateUniqueEmail();
    const password = 'Password123'; // Must meet complexity requirements

    await page.goto(`${BASE_URL}/register`);

    // Fill in the registration form
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    // Select Role - Assuming 'Student' is default or can be selected.
    // If not visible, Playwright might need to click a dropdown first.
    // For now, let's assume 'Student' is default or we're fine with it.
    // If 'Select your role' is a visible element, uncomment and adjust:
    // await page.getByRole('button', { name: 'Select your role' }).click();
    // await page.getByRole('option', { name: 'Student' }).click();
    
    // Select School - This assumes a school selection UI.
    // You might need to adjust based on your actual UI (e.g., clicking a dropdown)
    await page.getByLabel('School').locator('div').filter({ hasText: 'Select your school' }).first().click();
    // Assuming there's at least one school option available
    await page.getByRole('option', { name: /school/i }).first().click();


    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);

    // Click the registration button
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Expect redirection to the verify-otp page
    await expect(page).toHaveURL(`${BASE_URL}/register/verify-otp?email=${encodeURIComponent(uniqueEmail)}`);

    // Add a placeholder to check for the presence of OTP input field
    await expect(page.getByText('Enter the 6-digit code sent to')).toBeVisible();
    await expect(page.getByLabel('Please enter OTP code')).toBeVisible();
  });
});
