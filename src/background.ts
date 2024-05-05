chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
});
