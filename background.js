// Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tailwind Exporter extension installed/updated');
});

// Log when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});

// Set up communication between popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  console.log('Sender:', sender);
  
  // Relay messages as needed
  if (message.action === 'activateSelector') {
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
}); 