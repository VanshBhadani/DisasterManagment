# Asset Placeholder Files

This directory contains placeholder asset files for the Suraksha Learn platform. 

## Required Files for Full Functionality:

### Images (assets/images/)
- `hero-classroom.jpg` - 3D hero background (1920x1080)
- `earthquake-poster.jpg` - Video thumbnail (640x360)  
- `fire-poster.jpg` - Video thumbnail (640x360)
- `scene-classroom.jpg` - Simulation scene (800x600)
- `scene-under-desk.jpg` - Simulation scene (800x600)
- `scene-holding-on.jpg` - Simulation scene (800x600)
- `scene-fire-detected.jpg` - Fire simulation scene (800x600)
- `scene-evacuation-route.jpg` - Fire simulation scene (800x600)
- `scene-assembly-point.jpg` - Fire simulation scene (800x600)
- `quiz-earthquake-1.jpg` - Quiz illustration (400x300)
- `quiz-earthquake-2.jpg` - Quiz illustration (400x300)
- `quiz-fire-1.jpg` - Quiz illustration (400x300)

### Videos (assets/videos/)
- `earthquake-lesson.mp4` - 8-minute earthquake safety lesson (720p H.264)
- `fire-lesson.mp4` - 7-minute fire safety lesson (720p H.264)

### Documents (assets/materials/)
- `earthquake-checklist.pdf` - Emergency preparedness checklist
- `emergency-kit-guide.pdf` - Emergency kit preparation guide
- `family-plan-template.pdf` - Family emergency plan template
- `fire-safety-checklist.pdf` - Fire safety inspection checklist
- `evacuation-planning.pdf` - Evacuation route planning guide

## Placeholder Notes:
- All media references in the code point to these asset paths
- The application includes fallback handling for missing assets
- 3D hero scene will display static fallback if WebGL is unsupported
- Video players show poster images and handle missing video files gracefully

## Asset Guidelines:
- **Images**: JPEG format, web-optimized (85% quality)
- **Videos**: MP4 H.264, 720p recommended for compatibility
- **Documents**: PDF format with accessible text (not scanned)
- **Performance**: Optimize all assets for web delivery

The complete educational platform is fully functional with these placeholder paths.