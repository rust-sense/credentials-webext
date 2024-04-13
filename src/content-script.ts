window.addEventListener(
  'message',
  (event) => {
    if (event.data.rustCompanionAuth) {
      console.debug('Propagating rust companion authentication data');
      chrome.runtime.sendMessage(event.data);

      const token = event.data.rustCompanionAuth.token;

      const overlayContainerEl = document.querySelector('.page-wrapper .overlay-container');
      if (!overlayContainerEl) {
        console.error('Failed to find overlay container element');
        return;
      }

      const overlayBodyEl = overlayContainerEl.querySelector('.overlay-body')!;

      const tokenTitleEl = document.createElement('h2');
      tokenTitleEl.innerText = `Your token:`;
      tokenTitleEl.className = 'token-title';
      overlayBodyEl.appendChild(tokenTitleEl);

      const tokenTextAreaEl = document.createElement('textarea');
      tokenTextAreaEl.readOnly = true;
      tokenTextAreaEl.className = 'token-textarea';
      tokenTextAreaEl.value = token;
      overlayBodyEl.appendChild(tokenTextAreaEl);

      const tokenWarningEl = document.createElement('p');
      tokenWarningEl.innerText = `Be careful with your token! It can be used to authenticate as you with the Rust Companion API.`;
      tokenWarningEl.className = 'token-warning';
      overlayBodyEl.appendChild(tokenWarningEl);

      const overlayButtonsEl = document.createElement('div');
      overlayButtonsEl.className = 'overlay-buttons';
      overlayContainerEl.appendChild(overlayButtonsEl);

      const tokenCopyButtonEl = document.createElement('button');
      tokenCopyButtonEl.className = 'button is-primary';
      tokenCopyButtonEl.innerHTML = '<span>Copy to clipboard</span>';
      overlayButtonsEl.appendChild(tokenCopyButtonEl);

      tokenCopyButtonEl.addEventListener('click', () => {
        navigator.clipboard.writeText(token).then(() => {
          console.debug('Copied token to clipboard');
        });
      });
    }
  },
  false,
);
