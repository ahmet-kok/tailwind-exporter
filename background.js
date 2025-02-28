<<<<<<< HEAD
=======
// Global variables
let popupWindow = null;

>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tailwind Exporter extension installed/updated');
});

<<<<<<< HEAD
// Log when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
=======
// Handle click on extension icon to open detached popup window
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
  
  // If popup window already exists, focus it instead of creating a new one
  if (popupWindow && !chrome.runtime.lastError) {
    chrome.windows.update(popupWindow.id, { focused: true });
    return;
  }
  
  // Create a detached popup window
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 400,
    height: 600,
    left: screen.width - 420,
    top: 40
  }, (window) => {
    popupWindow = window;
  });
});

// Track when the popup window is closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (popupWindow && popupWindow.id === windowId) {
    popupWindow = null;
    
    // Send message to content script to deactivate selector
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'deactivateSelector'
        }).catch(err => console.error('Error deactivating selector:', err));
      }
    });
  }
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
});

// Set up communication between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  console.log('Sender:', sender);
  
<<<<<<< HEAD
  // Relay messages as needed
  if (message.action === 'activateSelector') {
=======
  // Relay selection activation/deactivation messages
  if (message.action === 'activateSelector' || message.action === 'deactivateSelector') {
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
    const tabId = sender.tab ? sender.tab.id : message.tabId;
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message)
        .then(response => {
          console.log('Response from content script:', response);
          sendResponse(response);
        })
        .catch(error => {
          console.error('Error sending message to content script:', error);
          sendResponse({ error: error.message });
        });
      return true; // Keep the messaging channel open for the async response
    }
  }
<<<<<<< HEAD
=======
  
  // Relay Tailwind CSS updates from content script to popup
  if (message.action === 'updateTailwindCSS' || message.action === 'showTailwindCSS') {
    chrome.runtime.sendMessage(message)
      .then(response => {
        console.log('Response from popup:', response);
        sendResponse(response);
      })
      .catch(error => {
        console.error('Error sending message to popup:', error);
      });
    return true; // Keep the messaging channel open for the async response
  }
  
  // Handle close popup request
  if (message.action === 'closePopup' && popupWindow) {
    chrome.windows.remove(popupWindow.id);
    popupWindow = null;
    sendResponse({ success: true });
    return true;
  }
>>>>>>> parent of fc460e1 (Refactor extension architecture and improve user experience)
}); 