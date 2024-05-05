chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: "https://companion-rust.facepunch.com/app",
  });
});
