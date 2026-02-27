import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1200, 'height': 2000})
        
        print("Navigating to docs...")
        page.goto("http://localhost:8000/docs", wait_until="networkidle")
        
        # Open POST /predict
        print("Expanding POST /predict...")
        page.get_by_text("/predict", exact=True).click()
        time.sleep(1)
        
        # Click "Try it out"
        print("Clicking Try it out...")
        page.get_by_role("button", name="Try it out").click()
        time.sleep(1)
        
        # -------- CASE 1 --------
        print("Executing Case 1...")
        payload1 = '{\n  "item_count": 2,\n  "complexity": 5,\n  "active_orders": 15,\n  "hour_of_day": 19,\n  "time_elapsed": 5,\n  "rider_travel_time": 12\n}'
        page.locator("textarea").fill(payload1)
        
        # Click Execute button
        page.get_by_role("button", name="Execute").click()
        
        # Wait for "Server response" section
        print("Waiting for response...")
        page.get_by_text("Response body").last.wait_for(state="visible")
        time.sleep(1) 
        
        print("Taking screenshot 1...")
        page.locator(".opblock-post").screenshot(path="case1.png")
        
        # Clear out button so we can change body
        print("Clearing out...")
        # In Swagger to clear
        page.get_by_role("button", name="Clear").click()
        time.sleep(1)
        
        # -------- CASE 2 --------
        print("Executing Case 2...")
        payload2 = '{\n  "item_count": 8,\n  "complexity": 9,\n  "active_orders": 35,\n  "hour_of_day": 20,\n  "time_elapsed": 2,\n  "rider_travel_time": 20\n}'
        page.locator("textarea").fill(payload2)
        
        page.get_by_role("button", name="Execute").click()
        
        page.get_by_text("Response body").last.wait_for(state="visible")
        time.sleep(1)
        
        print("Taking screenshot 2...")
        page.locator(".opblock-post").screenshot(path="case2.png")
        
        print("Done capturing screenshots.")
        browser.close()

if __name__ == "__main__":
    run()
