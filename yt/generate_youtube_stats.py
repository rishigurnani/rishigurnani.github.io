import json
import asyncio
from playwright.async_api import async_playwright

# List of YouTube video IDs
video_ids = ['wRN6wVhnn7E', 'srLJlK67tXc', 'TFWYoZoezrY', 'eeqzsGVvr9w']


async def get_view_count(video_id, page):
    url = f'https://www.youtube.com/watch?v={video_id}'
    await page.goto(url)

    try:
        await page.wait_for_selector("span.view-count", state="attached", timeout=10000)
        view_text = await page.inner_text("span.view-count")

        # Extract the number from something like "1,234 views"
        view_count_str = view_text.split()[0].replace(",", "").replace(".", "")
        return int(view_count_str)
    except Exception as e:
        print(f"Error fetching view count for {video_id}: {e}")
        return 0


async def generate_youtube_stats():
    total_views = 0
    most_viewed_video_id = ''
    most_views = 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for video_id in video_ids:
            views = await get_view_count(video_id, page)
            print(f"{video_id}: {views} views")
            total_views += views
            if views > most_views:
                most_views = views
                most_viewed_video_id = video_id

        await browser.close()

    # Create a dictionary to store the stats
    stats = {
        'total_views': total_views,
        'most_viewed_video_id': most_viewed_video_id,
        'most_viewed_video_url': f'https://www.youtube.com/watch?v={most_viewed_video_id}',
        'most_views': most_views
    }

    # Write the stats to a JSON file
    with open('youtube-stats.json', 'w') as json_file:
        json.dump(stats, json_file, indent=4)

    print("YouTube stats generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_youtube_stats())
