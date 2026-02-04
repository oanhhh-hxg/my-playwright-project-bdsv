import { chromium } from '@playwright/test';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://bdsvuong.hexigon.tech/');
    const text = await page.innerText('body');
    console.log(text);
    await browser.close();
})();
