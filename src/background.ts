function registerDeviceGcm(senderId: string): Promise<string> {
  return new Promise((resolve) => {
    chrome.gcm.register([senderId], (registrationId) => {
      resolve(registrationId);
    });
  });
}

async function getExpoPushToken(deviceId: string, registrationId: string): Promise<string> {
  const requestBody = JSON.stringify({
    deviceId: deviceId,
    experienceId: '@facepunch/RustCompanion',
    appId: 'com.facepunch.rust.companion',
    deviceToken: registrationId,
    type: 'fcm',
    development: false,
  });

  const response = await fetch('https://exp.host/--/api/v2/push/getExpoPushToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  const jsonResponse = await response.json();
  return jsonResponse.data.expoPushToken;
}

async function registerWithRustPlus(authToken: string, expoPushToken: string) {
  const requestBody = JSON.stringify({
    AuthToken: authToken,
    DeviceId: 'rustplus.js',
    PushKind: 0,
    PushToken: expoPushToken,
  });

  const response = await fetch('https://companion-rust.facepunch.com:443/api/push/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  const jsonResponse = await response.json();
  return jsonResponse;
}

async function registerCredentials(authToken: string) {
  const rustAppSenderId = '976529667804';
  const registrationId = await registerDeviceGcm(rustAppSenderId);
  console.log('Registration id', registrationId);

  const deviceId = crypto.randomUUID();
  const expoPushToken = await getExpoPushToken(deviceId, registrationId);
  console.log('Expo push token', expoPushToken);

  const randomAppId = `wp:receiver.push.com#${deviceId}`;
  const response = await registerWithRustPlus(authToken, expoPushToken);
  console.log('Registered with Rust+', response);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  registerCredentials(request.rustCompanionAuth.token).then((credentials) => {
    console.log('Registered credentials:', credentials);
    sendResponse(credentials);
  });
});
