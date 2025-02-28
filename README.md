# Tailwind Exporter

A Chrome extension that allows you to select web UI components and export them as Tailwind CSS.

## Features

- Point and click selection of any web element
- Automatic conversion of CSS styles to Tailwind classes
- Copy Tailwind code to clipboard with one click
- Visual highlighting of elements as you hover

## Installation

1. Clone this repository or download as ZIP
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the extension directory
5. The Tailwind Exporter icon should now appear in your extensions toolbar

## Usage

1. Navigate to any website
2. Click the Tailwind Exporter icon in your toolbar
3. Click the "Select Element" button
4. Hover over any element on the page and click to select it
5. The Tailwind CSS code for that element will be displayed in the popup
6. Click "Copy to Clipboard" to copy the code
7. Use ESC key to cancel selection

## Notes

- The extension currently provides approximate Tailwind classes based on computed styles
- Color mapping is simplified and works best with grayscale colors
- Not all CSS properties are supported yet

## Future Improvements

- Better color mapping to Tailwind color palette
- Support for more CSS properties
- Custom export options
- Element tree navigation

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## License

MIT 