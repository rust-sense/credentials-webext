console.debug('Registering ReactNativeWebView.postMessage handler');
(window as any).ReactNativeWebView = {
  postMessage: function (message) {
    console.debug('Received rust companion authentication data, forwarding it to the extension...');

    const authData = JSON.parse(message);
    window.postMessage({
      rustCompanionAuth: {
        steamId: authData.SteamId,
        token: authData.Token,
      },
    });
  },
};
