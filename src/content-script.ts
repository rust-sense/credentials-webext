window.addEventListener(
  'message',
  (event) => {
    if (event.data.rustCompanionAuth) {
      console.debug('Propagating rust companion authentication data')
      chrome.runtime.sendMessage(event.data);
    }
  },
  false,
);
