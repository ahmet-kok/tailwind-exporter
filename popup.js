document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded successfully');
  
  // Get DOM elements
  const activateButton = document.getElementById('activateSelector');
  const resultContainer = document.getElementById('result-container');
  const resultElement = document.getElementById('result');
  const copyButton = document.getElementById('copyToClipboard');
  const clearButton = document.getElementById('clearResult');
  const closeButton = document.getElementById('closePopup');
  const container = document.querySelector('.container');
  let isSelectingActive = false;
  
  // Set up the current active tab
  let currentTabId = null;
  
  // Get the active tab
  const getActiveTab = async () => {
    try {
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      if (tabs.length > 0) {
        currentTabId = tabs[0].id;
        return tabs[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting active tab:', error);
      return null;
    }
  };
  
  // Initialize by getting the active tab
  getActiveTab();
  
  // Close the popup window
  closeButton.addEventListener('click', () => {
    console.log('Close button clicked');
    
    // If selection is active, deactivate it first
    if (isSelectingActive && currentTabId) {
      chrome.tabs.sendMessage(currentTabId, { 
        action: 'deactivateSelector' 
      }).catch(err => console.error('Error deactivating selector:', err));
    }
    
    // Tell the background script to close the popup
    chrome.runtime.sendMessage({
      action: 'closePopup'
    });
  });

  // Activate element selector on the current page
  activateButton.addEventListener('click', async () => {
    console.log('Select Element button clicked');
    
    try {
      const tab = await getActiveTab();
      if (!tab) {
        console.error('No active tab found');
        return;
      }
      
      console.log('Current tab:', tab.id);
      
      // Toggle the selection state
      isSelectingActive = !isSelectingActive;
      
      // Update button text based on state
      if (isSelectingActive) {
        activateButton.textContent = 'Stop Selection';
        activateButton.style.backgroundColor = '#dc2626'; // Red color
        activateButton.classList.add('active');
        container.classList.add('real-time-mode');
        
        // Clear previous results when starting new selection
        resultElement.textContent = 'Hover over elements to see Tailwind CSS...';
        resultContainer.classList.remove('hidden');
        
        // Add status message
        const statusElem = document.createElement('div');
        statusElem.className = 'status';
        statusElem.textContent = 'Real-time mode activated';
        statusElem.id = 'status-message';
        if (!document.getElementById('status-message')) {
          resultContainer.appendChild(statusElem);
        }
        
        // Tell the content script to activate the selector
        chrome.tabs.sendMessage(tab.id, { 
          action: 'activateSelector', 
          realTimeMode: true 
        }, (response) => {
          console.log('Response from content script:', response);
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
          }
        });
      } else {
        activateButton.textContent = 'Select Element';
        activateButton.style.backgroundColor = '#2563eb'; // Blue color
        activateButton.classList.remove('active');
        container.classList.remove('real-time-mode');
        
        // Remove status message
        const statusElem = document.getElementById('status-message');
        if (statusElem) {
          statusElem.remove();
        }
        
        // Tell the content script to deactivate the selector
        chrome.tabs.sendMessage(tab.id, { 
          action: 'deactivateSelector' 
        });
      }
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
    
    // Handler for real-time updates
    if (request.action === 'updateTailwindCSS') {
      if (resultContainer.classList.contains('hidden')) {
        resultContainer.classList.remove('hidden');
      }
      resultElement.textContent = request.tailwindCSS;
      sendResponse({ success: true });
    }
    
    return true; // Keep the message channel open
  });
}); 