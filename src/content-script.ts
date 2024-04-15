type RustCompanionAuthData = {
	steamId: string;
	token: string;
};

function handleRustCompanionAuthMessage(data: RustCompanionAuthData) {
	console.debug("Received Rust Companion authentication data:", data);
	createTokenDisplayElements(data.token);
}

function copyTokenToClipboard(token: string) {
	navigator.clipboard
		.writeText(token)
		.then(() => {
			console.debug("Token copied to clipboard");
		})
		.catch((error) => {
			console.error("Failed to copy token to clipboard:", error);
		});
}

function createTokenDisplayElements(token: string) {
	const overlayContainerEl = document.querySelector(
		".page-wrapper .overlay-container",
	);
	if (!overlayContainerEl) {
		console.error("Failed to find overlay container element");
		return;
	}

	const overlayBodyEl = overlayContainerEl.querySelector(".overlay-body");
	if (!overlayBodyEl) {
		console.error("Failed to find overlay body element");
		return;
	}

	const tokenTitleEl = document.createElement("h2");
	tokenTitleEl.innerText = "Your token:";
	tokenTitleEl.className = "token-title";
	overlayBodyEl.appendChild(tokenTitleEl);

	const tokenTextAreaEl = document.createElement("textarea");
	tokenTextAreaEl.readOnly = true;
	tokenTextAreaEl.className = "token-textarea";
	tokenTextAreaEl.value = token;
	overlayBodyEl.appendChild(tokenTextAreaEl);

	const tokenWarningEl = document.createElement("p");
	tokenWarningEl.innerText =
		"Be careful with your token! It can be used to authenticate as you with the Rust Companion API.";
	tokenWarningEl.className = "token-warning";
	overlayBodyEl.appendChild(tokenWarningEl);

	const overlayButtonsEl = document.createElement("div");
	overlayButtonsEl.className = "overlay-buttons";
	overlayContainerEl.appendChild(overlayButtonsEl);

	const registerFCMButtonEl = document.createElement("button");
	registerFCMButtonEl.className = "button is-primary";
	registerFCMButtonEl.innerHTML = "<span>Register to FCM</span>";

	registerFCMButtonEl.addEventListener("click", () => {
		console.debug("Registering device to FCM");
		registerFCMButtonEl.disabled = true;
		registerFCMButtonEl.innerHTML = "<span>Registering...</span>";
		chrome.runtime
			.sendMessage({
				type: "REGISTER_FCM",
				token,
			})
			.then((response) => {
				console.debug("FCM registration response:", response);
				registerFCMButtonEl.disabled = false;
				registerFCMButtonEl.innerHTML = "<span>Register to FCM</span>";
			});
	});

	overlayButtonsEl.appendChild(registerFCMButtonEl);

	const tokenCopyButtonEl = document.createElement("button");
	tokenCopyButtonEl.className = "button is-secondary";
	tokenCopyButtonEl.innerHTML = "<span>Copy to clipboard</span>";

	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	tokenCopyButtonEl.addEventListener("click", () => {
		console.debug("Copying token to clipboard");
		tokenCopyButtonEl.innerHTML = "<span>Copied!</span>";
		copyTokenToClipboard(token);

		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			tokenCopyButtonEl.innerHTML = "<span>Copy to clipboard</span>";
		}, 3 * 1000);
	});

	overlayButtonsEl.appendChild(tokenCopyButtonEl);
}

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

      let timeoutId = null as number | null;
      tokenCopyButtonEl.addEventListener('click', () => {
        navigator.clipboard
          .writeText(token)
          .then(() => {
            console.debug('Copied token to clipboard');
            tokenCopyButtonEl.innerHTML = '<span>Copied!</span>';

            if (timeoutId !== null) {
              clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
              tokenCopyButtonEl.innerHTML = '<span>Copy to clipboard</span>';
            }, 3 * 1000);
          })
          .catch((error) => {
            console.error('Failed to copy token to clipboard:', error);
          });
      });
    }
  },
  false,
);
