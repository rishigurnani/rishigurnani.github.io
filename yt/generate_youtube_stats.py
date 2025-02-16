import requests
from bs4 import BeautifulSoup
import json

# List of YouTube video URLs or video IDs
video_ids = ['wRN6wVhnn7E', 'srLJlK67tXc', 'TFWYoZoezrY', 'eeqzsGVvr9w']

def get_view_count(video_id):
    url = f'https://www.youtube.com/watch?v={video_id}'
    response = requests.get(url)

    # If the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the view count in the HTML
        try:
            # Find the span tag with the view count info
            view_count_str = soup.find('meta', {'itemprop': 'interactionCount'})['content']
            return int(view_count_str)
        except Exception as e:
            print(f"Error scraping video {video_id}: {e}")
            return 0
    else:
        print(f"Error fetching video {video_id}: {response.status_code}")
        return 0

def generate_youtube_stats():
    total_views = 0
    most_viewed_video_id = ''
    most_views = 0

    for video_id in video_ids:
        views = get_view_count(video_id)
        total_views += views
        if views > most_views:
            most_views = views
            most_viewed_video_id = video_id

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
    generate_youtube_stats()
