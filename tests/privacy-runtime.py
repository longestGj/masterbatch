"""Focused browser check for the local P011 privacy page and P006 link."""
from playwright.sync_api import sync_playwright


BASE = "http://127.0.0.1:18087"
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in (1440, 768, 390):
        page = browser.new_page(viewport={"width": width, "height": 900})
        google_requests = []
        page.on("request", lambda req: google_requests.append(req.url) if "googletagmanager.com" in req.url or "google-analytics.com" in req.url else None)
        response = page.goto(BASE + "/privacy/", wait_until="networkidle")
        assert response.status == 200
        assert page.title() == "Privacy information | GE Masterbatch"
        assert page.locator('meta[name="description"]').get_attribute("content") == "Learn how GE handles website inquiries and analytics choices, and how to contact us about information you submitted."
        assert page.locator('link[rel="canonical"]').get_attribute("href") == BASE + "/privacy/"
        assert page.locator("main h1").count() == 1
        assert page.locator("main h1").inner_text() == "Privacy information"
        assert page.locator("main").get_by_text("The WordPress inquiry record has no automatic deletion date", exact=False).count() == 1
        assert page.locator('main a[href="/rfq"]').count() == 2
        assert page.locator('main a[href="mailto:jenny@ge-masterbatch.com"]').count() >= 1
        assert page.locator('footer a[href$="/privacy/"]').count() == 1
        assert page.locator('.ge-analytics-panel a[href$="/privacy/"]').count() == 1
        assert not google_requests
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), f"horizontal overflow at {width}px"
        inquiry = page.goto(BASE + "/rfq/", wait_until="networkidle")
        assert inquiry.status == 200
        assert page.locator('.ge-rfq-privacy a[href$="/privacy/"]').count() == 1
        page.close()
    browser.close()
print("PASS: P011 saved page renders at 1440/768/390, links resolve, no GA4 request before choice")
