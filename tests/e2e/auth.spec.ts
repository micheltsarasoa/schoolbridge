import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to log in with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByLabel('Email').fill('student@school.mg');
    await page.getByLabel('Password').fill('student123');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    
    // Wait for success toast with proper timeout
    await expect(page.getByText('Welcome! You have been successfully logged in.')).toBeVisible({ timeout: 10000 });
    
    // Verify redirect to dashboard
    await page.waitForURL('http://localhost:3000/dashboard/student', { timeout: 10000 });
  });

  test('should show an error message with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByLabel('Email').fill('wronguser@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    
    // Wait for error toast with proper assertion timeout
    await expect(page.getByText('The email or password you entered is incorrect. Please try again.')).toBeVisible({ timeout: 5000 });
  });

  test('should lock the account after multiple failed login attempts', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // Attempt login 5 times with wrong credentials
    for (let i = 0; i < 5; i++) {
      await page.getByLabel('Email').fill('lockuser@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      
      // Wait for either error or lock message
      if (i < 4) {
        // For first 4 attempts, expect regular error
        await expect(page.getByText('The email or password you entered is incorrect. Please try again.')).toBeVisible({ timeout: 5000 });
      }
      
      // Small delay between attempts to ensure server processes each request
      await page.waitForTimeout(500);
    }
    
    // After 5th attempt, expect account lock message
    await expect(page.getByText(/Too many failed login attempts. Please try again in a few minutes./)).toBeVisible({ timeout: 5000 });
  });
});