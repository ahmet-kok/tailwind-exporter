// State variables
let isSelecting = false;
<<<<<<< HEAD
=======
let isRealTimeMode = false;
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
let highlightedElement = null;
let highlightOverlay = null;
let lastProcessedElement = null;
let throttleTimeout = null;

// Log for debugging - check if content script is loaded
console.log('Tailwind Exporter content script loaded successfully');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);
  
  if (request.action === 'activateSelector') {
    console.log('Activating element selector');
<<<<<<< HEAD
    toggleElementSelector(true);
    sendResponse({ success: true });
  }
  return true;
=======
    isRealTimeMode = request.realTimeMode || false;
    toggleElementSelector(true);
    sendResponse({ success: true });
  }
  
  if (request.action === 'deactivateSelector') {
    console.log('Deactivating element selector');
    toggleElementSelector(false);
    sendResponse({ success: true });
  }
  
  return true; // Keep the messaging channel open
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
});

// Toggle element selector mode
function toggleElementSelector(activate) {
  console.log('Toggle selector called with activate =', activate);
  isSelecting = activate;
  
  if (activate) {
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // Create highlight overlay if it doesn't exist
    if (!highlightOverlay) {
      console.log('Creating highlight overlay');
      highlightOverlay = document.createElement('div');
      highlightOverlay.id = 'tailwind-exporter-highlight';
      document.body.appendChild(highlightOverlay);
    }
  } else {
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeyDown);
    
    // Remove highlight overlay
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
<<<<<<< HEAD
=======
    
    // Reset state
    lastProcessedElement = null;
    isRealTimeMode = false;
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
  }
}

// Handle mouse movement for highlighting elements
function handleMouseMove(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Get element under cursor (ignoring our overlay)
  highlightedElement = document.elementFromPoint(e.clientX, e.clientY);
  
  // Skip our own elements
  if (highlightedElement && highlightedElement.id === 'tailwind-exporter-highlight') {
    return;
  }
  
  // Update highlight overlay position
  updateHighlight();
  
<<<<<<< HEAD
=======
  // In real-time mode, send the Tailwind CSS to the popup
  if (isRealTimeMode && highlightedElement) {
    // Throttle the updates to avoid performance issues
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }
    
    throttleTimeout = setTimeout(() => {
      // Only process if the element has changed
      if (highlightedElement !== lastProcessedElement) {
        lastProcessedElement = highlightedElement;
        const tailwindCSS = convertToTailwind(highlightedElement);
        
        // Send the Tailwind CSS back to the popup
        chrome.runtime.sendMessage({
          action: 'updateTailwindCSS',
          tailwindCSS: tailwindCSS
        });
      }
    }, 200); // Throttle to once every 200ms
  }
  
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
  // For debugging purposes
  if (highlightedElement) {
    console.log('Hovering over:', highlightedElement.tagName);
  }
}

// Update the highlight overlay position and size
function updateHighlight() {
  if (!highlightedElement || !highlightOverlay) return;
  
  const rect = highlightedElement.getBoundingClientRect();
  
  highlightOverlay.style.display = 'block';
  highlightOverlay.style.position = 'fixed';
  highlightOverlay.style.top = rect.top + 'px';
  highlightOverlay.style.left = rect.left + 'px';
  highlightOverlay.style.width = rect.width + 'px';
  highlightOverlay.style.height = rect.height + 'px';
  highlightOverlay.style.border = '2px solid #2563eb';
  highlightOverlay.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
  highlightOverlay.style.zIndex = '2147483647';
  highlightOverlay.style.pointerEvents = 'none';
}

// Handle click to select an element
function handleClick(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  if (highlightedElement) {
    const tailwindCSS = convertToTailwind(highlightedElement);
    
    // Send the Tailwind CSS back to the popup
    chrome.runtime.sendMessage({
      action: 'showTailwindCSS',
      tailwindCSS: tailwindCSS
    });
    
<<<<<<< HEAD
    // Exit selection mode
    toggleElementSelector(false);
=======
    // If not in real-time mode, exit selection mode
    if (!isRealTimeMode) {
      toggleElementSelector(false);
    }
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
  }
}

// Handle Escape key to cancel selection
function handleKeyDown(e) {
  if (e.key === 'Escape' && isSelecting) {
    toggleElementSelector(false);
  }
}

// Convert element's computed styles to Tailwind CSS classes
function convertToTailwind(element) {
  const computedStyle = window.getComputedStyle(element);
  const tailwindClasses = [];
  
  // Typography
  const fontFamily = computedStyle.fontFamily.toLowerCase();
  if (fontFamily.includes('sans-serif')) tailwindClasses.push('font-sans');
  else if (fontFamily.includes('serif')) tailwindClasses.push('font-serif');
  else if (fontFamily.includes('monospace')) tailwindClasses.push('font-mono');
  
  const fontSize = parseInt(computedStyle.fontSize);
  if (fontSize <= 12) tailwindClasses.push('text-xs');
  else if (fontSize <= 14) tailwindClasses.push('text-sm');
  else if (fontSize <= 16) tailwindClasses.push('text-base');
  else if (fontSize <= 18) tailwindClasses.push('text-lg');
  else if (fontSize <= 20) tailwindClasses.push('text-xl');
  else if (fontSize <= 24) tailwindClasses.push('text-2xl');
  else if (fontSize <= 30) tailwindClasses.push('text-3xl');
  else if (fontSize <= 36) tailwindClasses.push('text-4xl');
  else if (fontSize <= 48) tailwindClasses.push('text-5xl');
  else tailwindClasses.push('text-6xl');
  
  const fontWeight = parseInt(computedStyle.fontWeight);
  if (fontWeight < 400) tailwindClasses.push('font-light');
  else if (fontWeight < 500) tailwindClasses.push('font-normal');
  else if (fontWeight < 600) tailwindClasses.push('font-medium');
  else if (fontWeight < 700) tailwindClasses.push('font-semibold');
  else tailwindClasses.push('font-bold');
  
  // Text alignment
  const textAlign = computedStyle.textAlign;
  if (textAlign === 'center') tailwindClasses.push('text-center');
  else if (textAlign === 'right') tailwindClasses.push('text-right');
  else if (textAlign === 'justify') tailwindClasses.push('text-justify');
  
  // Text color (simplified - would need a proper color mapping for accuracy)
  const textColor = computedStyle.color;
  const rgba = textColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
  if (rgba) {
    const [_, r, g, b] = rgba.map(Number);
    if (r === g && g === b) {
      // Grayscale
      if (r < 100) tailwindClasses.push('text-gray-900');
      else if (r < 150) tailwindClasses.push('text-gray-700');
      else if (r < 200) tailwindClasses.push('text-gray-500');
      else if (r < 240) tailwindClasses.push('text-gray-300');
      else tailwindClasses.push('text-gray-100');
    }
  }
  
  // Background
  const bgColor = computedStyle.backgroundColor;
  const bgRgba = bgColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
  if (bgRgba) {
    const [_, r, g, b, a] = bgRgba.map(Number);
    if (a !== 0) {
      if (r === g && g === b) {
        // Grayscale background
        if (r < 100) tailwindClasses.push('bg-gray-900');
        else if (r < 150) tailwindClasses.push('bg-gray-700');
        else if (r < 200) tailwindClasses.push('bg-gray-500');
        else if (r < 240) tailwindClasses.push('bg-gray-300');
        else tailwindClasses.push('bg-gray-100');
      }
    }
  }
  
  // Width and height
  if (element.offsetWidth) {
    if (computedStyle.width === '100%') tailwindClasses.push('w-full');
    else {
      const width = parseInt(computedStyle.width);
      if (width <= 16) tailwindClasses.push('w-4');
      else if (width <= 24) tailwindClasses.push('w-6');
      else if (width <= 32) tailwindClasses.push('w-8');
      else if (width <= 48) tailwindClasses.push('w-12');
      else if (width <= 64) tailwindClasses.push('w-16');
      else if (width >= 400) tailwindClasses.push('w-96');
    }
  }
  
  if (element.offsetHeight) {
    if (computedStyle.height === '100%') tailwindClasses.push('h-full');
    else {
      const height = parseInt(computedStyle.height);
      if (height <= 16) tailwindClasses.push('h-4');
      else if (height <= 24) tailwindClasses.push('h-6');
      else if (height <= 32) tailwindClasses.push('h-8');
      else if (height <= 48) tailwindClasses.push('h-12');
      else if (height <= 64) tailwindClasses.push('h-16');
      else if (height >= 400) tailwindClasses.push('h-96');
    }
  }
  
  // Margin and padding
  ['margin', 'padding'].forEach(property => {
    const prefix = property === 'margin' ? 'm' : 'p';
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    
    // Check if all sides are equal
    const top = parseInt(computedStyle[property + 'Top']);
    const right = parseInt(computedStyle[property + 'Right']);
    const bottom = parseInt(computedStyle[property + 'Bottom']);
    const left = parseInt(computedStyle[property + 'Left']);
    
    if (top === right && right === bottom && bottom === left) {
      if (top === 0) tailwindClasses.push(`${prefix}-0`);
      else if (top <= 4) tailwindClasses.push(`${prefix}-1`);
      else if (top <= 8) tailwindClasses.push(`${prefix}-2`);
      else if (top <= 12) tailwindClasses.push(`${prefix}-3`);
      else if (top <= 16) tailwindClasses.push(`${prefix}-4`);
      else if (top <= 24) tailwindClasses.push(`${prefix}-6`);
      else if (top <= 32) tailwindClasses.push(`${prefix}-8`);
      else tailwindClasses.push(`${prefix}-10`);
    } else {
      // Handle individual sides
      sides.forEach((side, index) => {
        const value = parseInt(computedStyle[property + side]);
        const sidePrefix = prefix + side.charAt(0).toLowerCase();
        
        if (value === 0) tailwindClasses.push(`${sidePrefix}-0`);
        else if (value <= 4) tailwindClasses.push(`${sidePrefix}-1`);
        else if (value <= 8) tailwindClasses.push(`${sidePrefix}-2`);
        else if (value <= 12) tailwindClasses.push(`${sidePrefix}-3`);
        else if (value <= 16) tailwindClasses.push(`${sidePrefix}-4`);
        else if (value <= 24) tailwindClasses.push(`${sidePrefix}-6`);
        else if (value <= 32) tailwindClasses.push(`${sidePrefix}-8`);
        else tailwindClasses.push(`${sidePrefix}-10`);
      });
    }
  });
  
  // Border
  const borderWidth = parseInt(computedStyle.borderWidth);
  if (borderWidth > 0) {
    if (borderWidth === 1) tailwindClasses.push('border');
    else if (borderWidth === 2) tailwindClasses.push('border-2');
    else if (borderWidth <= 4) tailwindClasses.push('border-4');
    else tailwindClasses.push('border-8');
    
    // Border color (simplified)
    const borderColor = computedStyle.borderColor;
    const borderRgba = borderColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
    if (borderRgba) {
      const [_, r, g, b] = borderRgba.map(Number);
      if (r === g && g === b) {
        // Grayscale
        if (r < 100) tailwindClasses.push('border-gray-900');
        else if (r < 150) tailwindClasses.push('border-gray-700');
        else if (r < 200) tailwindClasses.push('border-gray-500');
        else if (r < 240) tailwindClasses.push('border-gray-300');
        else tailwindClasses.push('border-gray-100');
      }
    }
  }
  
  // Border radius
  const borderRadius = parseInt(computedStyle.borderRadius);
  if (borderRadius > 0) {
    if (borderRadius <= 2) tailwindClasses.push('rounded-sm');
    else if (borderRadius <= 4) tailwindClasses.push('rounded');
    else if (borderRadius <= 6) tailwindClasses.push('rounded-md');
    else if (borderRadius <= 8) tailwindClasses.push('rounded-lg');
    else if (borderRadius <= 12) tailwindClasses.push('rounded-xl');
    else if (borderRadius <= 16) tailwindClasses.push('rounded-2xl');
    else if (borderRadius <= 24) tailwindClasses.push('rounded-3xl');
    else tailwindClasses.push('rounded-full');
  }
  
  // Display
  const display = computedStyle.display;
  if (display === 'flex') {
    tailwindClasses.push('flex');
    
    // Flex direction
    const flexDirection = computedStyle.flexDirection;
    if (flexDirection === 'column') tailwindClasses.push('flex-col');
    
    // Justify content
    const justifyContent = computedStyle.justifyContent;
    if (justifyContent === 'center') tailwindClasses.push('justify-center');
    else if (justifyContent === 'flex-end') tailwindClasses.push('justify-end');
    else if (justifyContent === 'space-between') tailwindClasses.push('justify-between');
    else if (justifyContent === 'space-around') tailwindClasses.push('justify-around');
    
    // Align items
    const alignItems = computedStyle.alignItems;
    if (alignItems === 'center') tailwindClasses.push('items-center');
    else if (alignItems === 'flex-end') tailwindClasses.push('items-end');
    else if (alignItems === 'stretch') tailwindClasses.push('items-stretch');
  } else if (display === 'grid') {
    tailwindClasses.push('grid');
  } else if (display === 'none') {
    tailwindClasses.push('hidden');
  } else if (display === 'block') {
    tailwindClasses.push('block');
  } else if (display === 'inline-block') {
    tailwindClasses.push('inline-block');
  }
  
  // Shadow
  const boxShadow = computedStyle.boxShadow;
  if (boxShadow && boxShadow !== 'none') {
    if (boxShadow.includes('0px 1px')) tailwindClasses.push('shadow-sm');
    else if (boxShadow.includes('0px 4px')) tailwindClasses.push('shadow');
    else if (boxShadow.includes('0px 10px')) tailwindClasses.push('shadow-md');
    else if (boxShadow.includes('0px 15px')) tailwindClasses.push('shadow-lg');
    else if (boxShadow.includes('0px 20px')) tailwindClasses.push('shadow-xl');
    else tailwindClasses.push('shadow-2xl');
  }
  
  // Generate the HTML tag with Tailwind classes
  const tagName = element.tagName.toLowerCase();
  
  // Generate Tailwind markup
  return `<${tagName} class="${tailwindClasses.join(' ')}">
  ${element.innerHTML ? '...' : ''}
</${tagName}>`;
} 