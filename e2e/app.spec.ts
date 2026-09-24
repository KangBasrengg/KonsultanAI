import { test, expect } from '@playwright/test';

test.describe('KonsultanAI End-to-End Suite', () => {

  test('1. Landing Page loads and displays main navigation', async ({ page }) => {
    await page.goto('/');
    
    // Page Title
    await expect(page).toHaveTitle(/KonsultanAI/i);
    
    // Brand header
    await expect(page.locator('text=KonsultanAI').first()).toBeVisible();

    // Desktop Navigation links inside nav
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Tentang', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Konsultasi AI', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Learning Center', exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: /LegalKita/i })).toBeVisible();

    // Verify Masuk CTA button in navbar
    const navMasukBtn = page.locator('nav button:has-text("Masuk")');
    await expect(navMasukBtn).toBeVisible();
  });

  test('2. Auth Modal works: Login, Register, and Forgot Password toggle', async ({ page }) => {
    await page.goto('/');

    // 1. Click Masuk in navbar to open modal
    const navMasukBtn = page.locator('nav button:has-text("Masuk")');
    await navMasukBtn.click();

    const modal = page.locator('.fixed.inset-0.z-\\[100\\]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Selamat Datang Kembali')).toBeVisible();
    await expect(modal.locator('input[name="email"]')).toBeVisible();
    await expect(modal.locator('input[name="password"]')).toBeVisible();

    // 2. Switch tab to "Daftar"
    await modal.locator('button:has-text("Daftar")').click();
    await expect(modal.locator('text=Buat Akun Baru')).toBeVisible();
    await expect(modal.locator('input[name="full_name"]')).toBeVisible();
    await expect(modal.locator('input[name="phone_number"]')).toBeVisible();

    // 3. Switch back to "Masuk" tab
    await modal.locator('button:has-text("Masuk")').click();
    await expect(modal.locator('text=Selamat Datang Kembali')).toBeVisible();

    // 4. Click "Lupa Password?" toggle
    const forgotBtn = modal.locator('button:has-text("Lupa Password?")');
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();

    // 5. Verify Forgot Password screen
    await expect(modal.locator('text=Lupa Kata Sandi')).toBeVisible();
    await expect(modal.locator('input[name="reset_email"]')).toBeVisible();
    await expect(modal.locator('button:has-text("Kirim Tautan Pemulihan")')).toBeVisible();

    // 6. Return to Login
    await modal.locator('button:has-text("Kembali ke Halaman Masuk")').click();
    await expect(modal.locator('text=Selamat Datang Kembali')).toBeVisible();

    // 7. Close modal with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('3. Templates Catalog displays documents and tier gating correctly', async ({ page }) => {
    await page.goto('/templates');

    // Page Heading
    await expect(page.locator('h1:has-text("Koleksi")')).toBeVisible();
    await expect(page.locator('input[placeholder*="Cari jenis surat"]')).toBeVisible();

    // Verify template cards exist
    const templateCards = page.locator('a[href^="/templates/"]');
    await expect(templateCards.first()).toBeVisible();

    // Verify tier badges exist (e.g. Free / Pro / Enterprise)
    const tierBadge = page.locator('text=/Free|Pro|Enterprise|Topup/i').first();
    await expect(tierBadge).toBeVisible();
  });

  test('4. LegalKita UMKM and Learning Center load with status 200', async ({ page }) => {
    // Check LegalKita UMKM
    const legalResp = await page.goto('/legalkita');
    expect(legalResp?.status()).toBe(200);
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Check Learning Center
    const learningResp = await page.goto('/learning');
    expect(learningResp?.status()).toBe(200);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('5. Mobile Viewport Layout and Responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Hamburger button exists on mobile
    const menuToggle = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(menuToggle).toBeVisible();

    // Open mobile menu
    await menuToggle.click();
    await expect(page.locator('nav').getByRole('link', { name: 'Konsultasi AI', exact: true })).toBeVisible();

    // Verify no horizontal scrolling bug (document scrollWidth should equal viewport width)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(395);
  });
});
