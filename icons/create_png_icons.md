# Creating PNG Icons

The Chrome extension requires PNG icons. You'll need to convert the SVG files to PNG. Here are a few methods:

## Method 1: Using ImageMagick

If you have ImageMagick installed, you can run:

```bash
convert icons/icon16.svg icons/icon16.png
convert icons/icon48.svg icons/icon48.png
convert icons/icon128.svg icons/icon128.png
```

## Method 2: Using a browser

1. Open each SVG file in a modern browser
2. Right-click on the image and select "Save Image As..."
3. Save it as a PNG file with the corresponding name

## Method 3: Using an online converter

Use an online SVG to PNG converter like:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

## Important Note

For the extension to work properly, you must have the following PNG files in the icons directory:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels) 
- icon128.png (128x128 pixels) 