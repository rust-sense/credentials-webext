import * as a1 from "./proto/android-checkin"
import * as a2 from "./proto/checkin"
import * as a3 from "./proto/mcs"

async function getExpoPushToken(
  deviceId: string,
  registrationId: string,
): Promise<string> {
  const requestBody = JSON.stringify({
    deviceId: deviceId,
    experienceId: "@facepunch/RustCompanion",
    appId: "com.facepunch.rust.companion",
    deviceToken: registrationId,
    type: "fcm",
    development: false,
  })

  const response = await fetch(
    "https://exp.host/--/api/v2/push/getExpoPushToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    },
  )

  const jsonResponse = await response.json()
  return jsonResponse.data.expoPushToken
}

async function registerWithRustPlus(authToken: string, expoPushToken: string) {
  const requestBody = JSON.stringify({
    AuthToken: authToken,
    DeviceId: "rustplus.js",
    PushKind: 0,
    PushToken: expoPushToken,
  })

  const response = await fetch(
    "https://companion-rust.facepunch.com:443/api/push/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    },
  )

  const jsonResponse = await response.json()
  return jsonResponse
}

type Registration = {
  gcm: {
    androidId: string
    securityToken: string
    appId: string
    token: string
  }
  fcm: {
    token: string
    pushSet: string
  }
  keys: {
    privateKey: string
    publicKey: string
    authSecret: string
  }
}

async function registerCredentials(authToken: string): Promise<Registration> {
  console.log(a1, a2, a3);
  //crypto.subtle.generateKey()
  /*
  const rustAppSenderId = '976529667804';

  const deviceId = crypto.randomUUID();
  const expoPushToken = await getExpoPushToken(deviceId, registrationId);
  console.log('Expo push token', expoPushToken);

  const randomAppId = `wp:receiver.push.com#${deviceId}`;
  const response = await registerWithRustPlus(authToken, expoPushToken);
  console.log('Registered with Rust+', response);
  */

  return {
    gcm: {
      androidId: "androidId",
      securityToken: "security",
      appId: "appId",
      token: "token",
    },
    fcm: {
      token: "token",
      pushSet: "pushSet",
    },
    keys: {
      privateKey: "privateKey",
      publicKey: "publicKey",
      authSecret: "authSecret",
    },
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request)
  if (request.type === "REGISTER_FCM") {
    const { token } = request
    registerCredentials(token).then((credentials) => {
      console.log("Registered credentials:", credentials)
      setTimeout(() => {
        sendResponse(credentials)
      }, 5000)
    })

    return true
  }
})
