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
  const statusElement = document.getElementById('status');
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
  
  // Function to show status messages
  const showStatus = (message, type = '') => {
    statusElement.textContent = message;
    statusElement.className = ''; // Reset classes
    if (type) statusElement.classList.add(type);
    statusElement.classList.remove('hidden');
    
    // Automatically hide success messages after some time
    if (type === 'success') {
      setTimeout(() => {
        statusElement.classList.add('hidden');
      }, 2000);
    }
  };
  
  // Close the popup window (note: this will only work if we have a background script)
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      console.log('Close button clicked');
      
      // If selection is active, deactivate it first
      if (isSelectingActive && currentTabId) {
        chrome.tabs.sendMessage(currentTabId, { 
          action: 'deactivateSelector' 
        }).catch(err => console.error('Error deactivating selector:', err));
      }
      
      // Close the popup if possible
      window.close();
    });
  }

  // Activate element selector on the current page
  activateButton.addEventListener('click', async () => {
    console.log('Activate button clicked');
    
    try {
      const tab = await getActiveTab();
      if (!tab) {
        showStatus('Error: Could not get active tab', 'error');
        return;
      }
      
      currentTabId = tab.id;
      
      // Toggle selection mode
      isSelectingActive = !isSelectingActive;
      
      if (isSelectingActive) {
        // Activate mode
        activateButton.textContent = 'Cancel Selection';
        activateButton.classList.add('active');
        activateButton.setAttribute('data-active', 'true');
        
        // Show status message
        showStatus('Element selection activated');
        
        // Tell the content script to activate the selector
        console.log('Sending activateSelector message to tab', tab.id);
        chrome.tabs.sendMessage(tab.id, { 
          action: 'activateSelector',
          copyOnClick: true
        }).then(response => {
          console.log('Received response from content script:', response);
          if (!response || !response.success) {
            throw new Error('Content script did not acknowledge the command');
          }
        }).catch(err => {
          console.error('Error sending message to content script:', err);
          showStatus('Error: Could not activate selector. Try reloading the page.', 'error');
          isSelectingActive = false;
          activateButton.textContent = 'Select Element';
          activateButton.classList.remove('active');
        });
      } else {
        // Deactivate mode
        activateButton.textContent = 'Select Element';
        activateButton.classList.remove('active');
        activateButton.removeAttribute('data-active');
        
        // Update status message
        showStatus('Selection mode canceled');
        
        // Tell the content script to deactivate the selector
        chrome.tabs.sendMessage(tab.id, { 
          action: 'deactivateSelector'
        });
        
        // Hide status after a delay
        setTimeout(() => {
          statusElement.classList.add('hidden');
        }, 2000);
      }
    } catch (error) {
      console.error('Error toggling selector:', error);
      showStatus('Error: Could not activate selector', 'error');
    }
  });

  // Copy Tailwind CSS to clipboard
  if (copyButton) {
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
  }

  // Clear the result
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      resultElement.textContent = '';
      resultContainer.classList.add('hidden');
    });
  }

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message in popup:', request);
    
    if (request.action === 'showTailwindCSS') {
      if (resultElement && resultContainer) {
        resultElement.textContent = request.tailwindCSS;
        resultContainer.classList.remove('hidden');
      }
      sendResponse({ success: true });
    }
    
    // Handler for real-time updates
    if (request.action === 'updateTailwindCSS') {
      if (resultElement && resultContainer) {
        if (resultContainer.classList.contains('hidden')) {
          resultContainer.classList.remove('hidden');
        }
        resultElement.textContent = request.tailwindCSS;
      }
      sendResponse({ success: true });
    }
    
    if (request.action === 'selectionComplete') {
      // Reset button state
      activateButton.textContent = 'Select Element';
      activateButton.classList.remove('active');
      activateButton.removeAttribute('data-active');
      isSelectingActive = false;
      
      // Update status
      showStatus('Element and children copied to clipboard!', 'success');
      
      sendResponse({ success: true });
    }
    
    return true; // Keep the message channel open
  });
}); 