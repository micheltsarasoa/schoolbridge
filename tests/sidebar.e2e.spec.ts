import { test, expect } from '@playwright/test';

test.describe('Sidebar Customization', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin login page and log in as an admin
    await page.goto('/login');
    try {
      await page.waitForSelector('input[name="email"]', { timeout: 60000 });
    } catch (error) {
      console.log(await page.content());
      throw error;
    }
    await page.fill('input[name="email"]', 'admin@schoolbridge.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Navigate to the sidebar customization page for a specific school
    await page.goto('/dashboard/admin/schools/ckxyz1234/sidebar');
  });

  test('should allow an admin to create a new sidebar configuration', async ({ page }) => {
    // Add a new link
    await page.click('button:has-text("Add Link")');
    await page.fill('input[name="items.0.label"]', 'Test Link');
    await page.fill('input[name="items.0.href"]', '/test-link');
    await page.click('button:has-text("Add Role")');
    await page.selectOption('select[name="items.0.roles.0"]', 'STUDENT');
    
    // Save the configuration
    await page.click('button:has-text("Save Configuration")');
    
    // Expect a success message
    await expect(page.locator('text=Configuration saved successfully')).toBeVisible();
    
    // Verify the new link is in the preview
    await expect(page.locator('a:has-text("Test Link")')).toBeVisible();
  });

  test('should allow an admin to update an existing sidebar configuration', async ({ page }) => {
    // Edit the first link's label
    await page.fill('input[name="items.0.label"]', 'Updated Link');
    
    // Save the configuration
    await page.click('button:has-text("Save Configuration")');
    
    // Expect a success message
    await expect(page.locator('text=Configuration saved successfully')).toBeVisible();
    
    // Verify the updated link is in the preview
    await expect(page.locator('a:has-text("Updated Link")')).toBeVisible();
  });

  test('should allow an admin to delete a sidebar item', async ({ page }) => {
    // Delete the first item
    await page.click('button[aria-label="Delete item"]');
    
    // Save the configuration
    await page.click('button:has-text("Save Configuration")');
    
    // Expect a success message
    await expect(page.locator('text=Configuration saved successfully')).toBeVisible();
    
    // Verify the item is no longer in the preview
    await expect(page.locator('a:has-text("Updated Link")')).not.toBeVisible();
  });
});