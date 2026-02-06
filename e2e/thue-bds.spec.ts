import { test, expect } from '@playwright/test';

test.describe('Thuê BĐS Screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/danh-sach-cho-thue-bat-dong-san');
        await page.waitForLoadState('networkidle');
    });

    test('verify page title and filters are visible', async ({ page }) => {
        // Verify Page Title
        await expect(page).toHaveTitle(/Danh sách thuê bất động sản/i);

        // Verify Filter elements
        await expect(page.getByPlaceholder('Nhập từ khoá')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Thành phố' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Phường xã' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dự án' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Tìm kiếm' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Đặt lại' })).toBeVisible();
    });

    test('verify rental listing items are displayed', async ({ page }) => {
        // Listings in rental often contain "triệu/tháng" or similar patterns.
        // We'll use a broad filter for now.
        const listings = page.locator('div').filter({ hasText: /m2|tỷ|triệu/ });
        await expect(listings.first()).toBeVisible();

        const count = await listings.count();
        console.log(`Found ${count} rental listing-related elements`);
        expect(count).toBeGreaterThan(0);
    });

    test('verify search functionality by keyword', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        const keyword = 'Chung cư';
        await searchInput.fill(keyword);
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();

        await page.waitForTimeout(2000);

        const listings = page.locator('div').filter({ hasText: /m2|tỷ|triệu/ });
        if (await listings.count() > 0) {
            await expect(listings.first()).toContainText(new RegExp(keyword, 'i'));
        }
    });

    test('verify reset button works', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Nhập từ khoá');
        await searchInput.fill('Test Keyword');

        const resetBtn = page.getByRole('button', { name: 'Đặt lại' });
        await resetBtn.click();

        await expect(searchInput).toHaveValue('');
    });

    test('verify pagination is visible', async ({ page }) => {
        // Check if pagination exists (assuming there's enough data for multiple pages)
        const page2 = page.getByRole('listitem').filter({ hasText: '2' });
        const nextBtn = page.getByRole('listitem', { name: 'Next Page' }).or(page.locator('.ant-pagination-next'));

        // Check for either page 2 or the next button
        await expect(page2.first().or(nextBtn.first())).toBeVisible();
    });

    const expectedCities = [
        "Tất cả", "Hà Nội", "Hồ Chí Minh", "An Giang", "Bắc Ninh", "Cà Mau",
        "Cần Thơ", "Cao Bằng", "Đắk Lắk", "Đà Nẵng", "Điện Biên", "Đồng Nai",
        "Đồng Tháp", "Gia Lai", "Hải Phòng", "Hà Tĩnh", "Huế", "Hưng Yên",
        "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An",
        "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
        "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hoá", "Tuyên Quang", "Vĩnh Long"
    ];

    test('verify "Thành phố" dropdown contains correct data', async ({ page }) => {
        await page.getByRole('button', { name: 'Thành phố' }).first().click();
        const dropdownList = page.getByRole('listbox');
        await expect(dropdownList).toBeVisible();

        const actualText = await dropdownList.innerText();
        for (const city of expectedCities) {
            expect(actualText).toContain(city);
        }
    });

    test('verify "Thành phố" dropdown shows correct selected value', async ({ page }) => {
        const cityToSelect = 'Hà Nội';
        const dropdownBtn = page.getByRole('button', { name: 'Thành phố' }).first();

        await dropdownBtn.click();
        // Click the option from the listbox
        await page.getByRole('option', { name: cityToSelect, exact: true }).click();

        // After selection, the button should show the selected city name
        await expect(dropdownBtn).toContainText(cityToSelect);
    });


    const expectedWardsAnGiang = [
        "Tất cả", "An Biên", "An Châu", "An Cư", "An Minh", "An Phú", "Ba Chúc",
        "Bình An", "Bình Đức", "Bình Giang", "Bình Hòa", "Bình Mỹ", "Bình Sơn",
        "Bình Thạnh Đông", "Cần Đăng", "Châu Đốc", "Châu Phong", "Châu Phú", "Châu Thành",
        "Chi Lăng", "Chợ Mới", "Chợ Vàm", "Cô Tô", "Cù Lao Giêng", "Định Hòa", "Định Mỹ",
        "Đông Hòa", "Đông Hưng", "Đông Thái", "Giang Thành", "Giồng Riềng", "Gò Quao",
        "Hà Tiên", "Hòa Điền", "Hòa Hưng", "Hòa Lạc", "Hòa Thuận", "Hội An", "Hòn Đất",
        "Hòn Nghệ", "Khánh Bình", "Kiên Hải", "Kiên Lương", "Long Điền", "Long Kiến",
        "Long Phú", "Long Thạnh", "Long Xuyên", "Mỹ Đức", "Mỹ Hòa Hưng", "Mỹ Thới",
        "Mỹ Thuận", "Ngọc Chúc", "Nhơn Hội", "Nhơn Mỹ", "Núi Cấm", "Óc Eo", "Ô Lâm",
        "Phú An", "Phú Hòa", "Phú Hữu", "Phú Lâm", "Phú Quốc", "Phú Tân", "Rạch Giá",
        "Sơn Hải", "Sơn Kiên", "Tân An", "Tân Châu", "Tân Hiệp", "Tân Hội", "Tân Thạnh",
        "Tây Phú", "Tây Yên", "Thới Sơn", "Thạnh Đông", "Thạnh Hưng", "Thạnh Lộc",
        "Thạnh Mỹ Tây", "Thoại Sơn", "Thổ Châu", "Tiên Hải", "Tịnh Biên", "Tô Châu", "Tri Tôn",
        "U Minh Thượng", "Vân Khánh", "Vĩnh An", "Vĩnh Bình", "Vĩnh Điều", "Vĩnh Gia",
        "Vĩnh Hanh", "Vĩnh Hậu", "Vĩnh Hòa", "Vĩnh Hòa Hưng", "Vĩnh Phong", "Vĩnh Tế",
        "Vĩnh Thạnh Trung", "Vĩnh Thông", "Vĩnh Thuận", "Vĩnh Trạch", "Vĩnh Tuy", "Vĩnh Xương"
    ];

    test('verify "Phường xã" dropdown shows all correct data when "An Giang" is selected', async ({ page }) => {
        // 1. Select "An Giang" in City dropdown
        await page.getByRole('button', { name: 'Thành phố' }).first().click();
        await page.getByRole('option', { name: 'An Giang', exact: true }).click();

        // 2. Open "Phường xã" dropdown
        await page.getByRole('button', { name: 'Phường xã' }).first().click();
        const dropdownList = page.getByRole('listbox');
        await expect(dropdownList).toBeVisible();

        // 3. The list is virtualized, so we need to scroll to collect all items
        const foundWards = new Set<string>();
        let previousCount = -1;
        let attempts = 0;
        const maxAttempts = 100; // Increased for long lists

        while (foundWards.size > previousCount && attempts < maxAttempts) {
            previousCount = foundWards.size;

            const options = await dropdownList.getByRole('option').all();
            for (const option of options) {
                const text = await option.innerText();
                // We only do trim(), no normalization, so that any encoding mismatch (like Mojibake) will be caught.
                if (text) foundWards.add(text.trim());
            }

            // Scroll down: Use JS to scroll the parent of the options
            const firstOption = dropdownList.getByRole('option').first();
            await firstOption.evaluate(el => {
                const container = el.closest('.overflow-y-auto');
                if (container) container.scrollBy(0, container.clientHeight);
            });

            await page.waitForTimeout(500);
            attempts++;
        }

        console.log(`Found ${foundWards.size} unique wards in dropdown.`);

        // Detect discrepancies strictly
        const missing = expectedWardsAnGiang.filter(w => !foundWards.has(w));
        const extra = Array.from(foundWards).filter(w => !expectedWardsAnGiang.includes(w));

        if (missing.length > 0) {
            console.log("❌ Missing or mismatched wards:", missing);
        }
        if (extra.length > 0) {
            console.log("⚠️ Unexpected text found on UI (possibly encoding error):", extra);
        }

        // Final assertion: every expected ward must exist exactly as written in the list
        for (const ward of expectedWardsAnGiang) {
            expect(foundWards.has(ward), `Expected ward "${ward}" was not found or has an encoding issue.`).toBeTruthy();
        }

        expect(foundWards.size).toBe(expectedWardsAnGiang.length);
    });

});