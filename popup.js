document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded successfully');
  
  const activateButton = document.getElementById('activateSelector');
  const resultContainer = document.getElementById('result-container');
  const resultElement = document.getElementById('result');
  const copyButton = document.getElementById('copyToClipboard');
  const clearButton = document.getElementById('clearResult');

  // Activate element selector on the current page
  activateButton.addEventListener('click', async () => {
    console.log('Select Element button clicked');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Current tab:', tab.id);
      
      // Tell the content script to activate the selector
      chrome.tabs.sendMessage(tab.id, { action: 'activateSelector' }, (response) => {
        console.log('Response from content script:', response);
        if (chrome.runtime.lastError) {
          console.error('Error sending message to content script:', chrome.runtime.lastError);
        }
      });
      
      // Close the popup to make selection easier
      window.close();
    } catch (error) {
      console.error('Error in activateButton click handler:', error);
    }
  });

  // Copy Tailwind CSS to clipboard
  copyButton.addEventListener('click', () => {
    const tailwindCSS = resultElement.textContent;
    navigator.clipboard.writeText(tailwindCSS)
      .then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy to Clipboard';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });

  // Clear the result
  clearButton.addEventListener('click', () => {
    resultElement.textContent = '';
    resultContainer.classList.add('hidden');
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showTailwindCSS') {
      resultElement.textContent = request.tailwindCSS;
      resultContainer.classList.remove('hidden');
      sendResponse({ success: true });
    }
  });
}); 