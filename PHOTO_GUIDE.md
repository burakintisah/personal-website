# Photography Page - Dynamic Photo Loading Guide

## 🎉 New Dynamic System!
No more manually editing arrays! Just add photos to folders and update a simple manifest file.

## How It Works

### Step 1: Add Photos to Folders
Create and add photos to these folders:
```
public/
└── photos/
    ├── korea/          ← Add your Korea photos here
    ├── japan/          ← Add your Japan photos here  
    ├── basketball/     ← Add your Basketball photos here
    └── travel/         ← Add your Travel photos here
```

### Step 2: Update the Manifest (Super Easy!)
Edit `src/data/photoManifest.ts` and just add the filename:

```javascript
export const PHOTO_MANIFEST = {
  korea: [
    'IMG_4720.jpeg',
    'IMG_4721.jpeg',        ← Just add the filename!
    'seoul_sunset.jpg',     ← That's it!
  ],
  
  japan: [
    'tokyo_street.jpg',     ← Add your Japan photos
    'mount_fuji.jpeg',
  ],
  
  // ... other categories
};
```

### Step 3: That's It! 
The website will automatically:
- ✅ Generate proper URLs (`/photos/korea/your-photo.jpg`)
- ✅ Create descriptive alt text from filename
- ✅ Show filter buttons only for folders with photos
- ✅ Handle all the photo loading logic

## Adding New Categories

Want to add a "Food" category?

1. **Create folder:** `public/photos/food/`
2. **Add photos** to the folder
3. **Update manifest:**
```javascript
export const PHOTO_MANIFEST = {
  // ... existing categories
  
  food: [
    'delicious_pasta.jpg',
    'street_food.jpeg',
  ],
};
```

The "Food" filter button will automatically appear!

## Benefits of This System

- 🚀 **Much Faster:** Just add filename instead of full object
- 🔄 **Auto-Generated:** URLs, alt text, and IDs created automatically  
- 🎯 **Smart Filtering:** Only shows categories that have photos
- 📝 **Clean Alt Text:** Converts "seoul_sunset.jpg" → "Korea - seoul sunset"
- 🆔 **Auto IDs:** No need to track ID numbers manually

## File Format Support
Supports: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Current Photos
- ✅ Korea: IMG_4720.jpeg
- ⏳ Japan: Add your photos to manifest
- ⏳ Basketball: Add your photos to manifest  
- ⏳ Travel: Add your photos to manifest

## Quick Example
```javascript
// Old way (tedious):
{
  id: 8,
  url: '/photos/korea/IMG_4721.jpeg', 
  alt: 'Korea travel photo',
  width: 1200,
  height: 800,
  folder: 'Korea',
}

// New way (simple):
'IMG_4721.jpeg'  // Just add this to the korea array!
```

## Tips
- Use web-optimized formats (JPEG, WebP)
- Keep file sizes reasonable (< 2MB per photo)
- Use descriptive alt text for accessibility
- Width/height don't need to be exact - they're for layout hints 