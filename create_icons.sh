#!/bin/bash

# This script creates simple placeholder SVG icons for the extension

# Create icon16.svg
cat > icons/icon16.svg << EOL
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#2563eb" rx="3" />
  <text x="8" y="12" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle">T</text>
</svg>
EOL

# Create icon48.svg
cat > icons/icon48.svg << EOL
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#2563eb" rx="9" />
  <text x="24" y="34" font-family="Arial" font-size="34" font-weight="bold" fill="white" text-anchor="middle">T</text>
</svg>
EOL

# Create icon128.svg
cat > icons/icon128.svg << EOL
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#2563eb" rx="24" />
  <text x="64" y="88" font-family="Arial" font-size="90" font-weight="bold" fill="white" text-anchor="middle">T</text>
</svg>
EOL

echo "SVG icons created successfully!" 