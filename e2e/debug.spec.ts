import { test } from '@playwright/test';

test('dump text', async ({ page }) => {
    await page.goto('https://bdsvuong.hexigon.tech/');
    const bodyText = await page.innerText('body');
    console.log('--- BODY TEXT START ---');
    console.log(bodyText);
    console.log('--- BODY TEXT END ---');

    const allLinks = await page.locator('a').allInnerTexts();
    console.log('--- ALL LINKS ---');
    console.log(allLinks);
});
