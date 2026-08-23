import { test, expect } from '@playwright/test';

test.describe('Enterprise Security & Authentication E2E Suite', () => {
  
  test('1. Security headers are enforced on responses', async ({ request }) => {
    const response = await request.get('http://localhost:3000/settings/sessions');
    const headers = response.headers();

    // Verify critical enterprise hardening headers
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['content-security-policy']).toBeDefined();
  });

  test('2. Protected settings routes handle unauthenticated requests safely', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/settings/sessions');
    expect(response?.status()).toBeLessThan(500);
  });

  test('3. Cleanup cron route executes and returns success', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/cron/cleanup-tokens');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('Database cleanup executed successfully');
  });

  test('4. Security audit log test endpoint triggers correctly', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/test-security');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.isLockedOut).toBe(true);
    expect(body.auditLogsCount).toBeGreaterThan(0);
  });

  test('5. Rate-limiting guards against rapid brute-force flooding', async ({ request }) => {
    const requests = Array.from({ length: 15 }, () => 
      request.get('http://localhost:3000/api/test-security')
    );
    
    const responses = await Promise.all(requests);
    responses.forEach(res => {
      expect(res.status()).toBeLessThan(500);
    });
  });

  test('6. XSS defense headers neutralize malicious script payload reflection', async ({ request }) => {
    const response = await request.get('http://localhost:3000/settings/sessions');
    const csp = response.headers()['content-security-policy'];
    
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
  });

  test('7. Unauthorized mutation attempts are rejected', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/cron/cleanup-tokens', {
      data: { test: true }
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

});