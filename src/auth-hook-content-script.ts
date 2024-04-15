console.debug("Registering ReactNativeWebView.postMessage handler")

// biome-ignore lint/suspicious/noExplicitAny: Needed to define ReactNativeWebView in window
;(window as any).ReactNativeWebView = {
  postMessage: (message) => {
    console.debug(
      "Received rust companion authentication data, forwarding it to the extension...",
    )

    const authData = JSON.parse(message)
    window.postMessage({
      rustCompanionAuth: {
        steamId: authData.SteamId,
        token: authData.Token,
      },
    })
  },
}
