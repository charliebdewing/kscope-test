// TODO: Add some e2e tests here

import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.file-drop-container > h2')).toHaveText('Upload Files');
})

// Fake drag and drop movements

// Double click on an item to enable edit mode

// Add an item to a group

// Uploading files

// Downloading files (If that gets added in)

