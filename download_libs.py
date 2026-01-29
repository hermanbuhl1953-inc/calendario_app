#!/usr/bin/env python3
"""Download Bootstrap and FontAwesome from CDN and save locally"""
import urllib.request
import os

DOWNLOADS = [
    # Bootstrap 5.3.0
    {
        'url': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'path': 'static/lib/bootstrap/bootstrap.min.css'
    },
    {
        'url': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        'path': 'static/lib/bootstrap/bootstrap.bundle.min.js'
    },
    # FontAwesome 6.4.0
    {
        'url': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'path': 'static/lib/fontawesome/all.min.css'
    },
    {
        'url': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
        'path': 'static/lib/fontawesome/fa-solid-900.woff2'
    },
]

def download_file(url, path):
    """Download file from URL and save to path"""
    print(f"Downloading {url}...")
    try:
        urllib.request.urlretrieve(url, path)
        print(f"✅ Saved to {path}")
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")

if __name__ == '__main__':
    for item in DOWNLOADS:
        # Create directory if needed
        dir_path = os.path.dirname(item['path'])
        os.makedirs(dir_path, exist_ok=True)
        
        # Download file
        download_file(item['url'], item['path'])
    
    print("\n✅ All libraries downloaded!")
