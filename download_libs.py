#!/usr/bin/env python3
"""Download Bootstrap and FontAwesome from CDN and save locally"""
import urllib.request
import os
from pathlib import Path

# Get absolute path to project root
PROJECT_ROOT = Path(__file__).parent.absolute()

DOWNLOADS = [
    # Bootstrap 5.3.0
    {
        'url': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        'path': PROJECT_ROOT / 'static' / 'lib' / 'bootstrap' / 'bootstrap.min.css'
    },
    {
        'url': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        'path': PROJECT_ROOT / 'static' / 'lib' / 'bootstrap' / 'bootstrap.bundle.min.js'
    },
    # FontAwesome 6.4.0
    {
        'url': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'path': PROJECT_ROOT / 'static' / 'lib' / 'fontawesome' / 'all.min.css'
    },
    {
        'url': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
        'path': PROJECT_ROOT / 'static' / 'lib' / 'fontawesome' / 'webfonts' / 'fa-solid-900.woff2'
    },
    {
        'url': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.ttf',
        'path': PROJECT_ROOT / 'static' / 'lib' / 'fontawesome' / 'webfonts' / 'fa-solid-900.ttf'
    },
]

def download_file(url, path):
    """Download file from URL and save to path"""
    print(f"📥 Downloading {url}...")
    try:
        urllib.request.urlretrieve(url, str(path))
        size_kb = path.stat().st_size / 1024
        print(f"✅ Saved to {path} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")
        return False

if __name__ == '__main__':
    print(f"📁 Project root: {PROJECT_ROOT}")
    print(f"🚀 Starting downloads...\n")
    
    success_count = 0
    for item in DOWNLOADS:
        # Create directory if needed
        item['path'].parent.mkdir(parents=True, exist_ok=True)
        
        # Download file
        if download_file(item['url'], item['path']):
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Downloaded {success_count}/{len(DOWNLOADS)} files successfully!")
    print(f"📦 Static libraries ready in: {PROJECT_ROOT / 'static' / 'lib'}")
    print(f"{'='*60}")

