---
layout: default
title: Redirect
parent: Auth SDK
nav_order: 2
---

# Auth SDK Redirect

## Integrating iframe

### 1. Configure your Auth SDK URL

First you need to get your [Temporary Token](getting-started.html). After you have it append the URL parameter `api_key=${TEMPORARY_TOKEN}` to your authentication link.

```js
const AUTH_LINK = new URL("https://sdk.finsquid.io/auth");
AUTH_LINK.searchParams.set("api_key", TEMPORARY_TOKEN);
// URI to your App where you handle the results of the authentication flow
AUTH_LINK.searchParams.set("redirect", "http://localhost:3000");
```

Add the `authentication link` to your App with a navigation link (or similar):.

```html
<a href="{AUTH_LINK}">Connect your bank</a>
```

### 2. Handle responses from Auth SDK

The response will be delivered by navigating to the specified `redirect` uri in the Auth SDK URL.

This `redirect` can be:

* a redirect back to your web app where you process the response and asynchronously communicate with your backend service
* a universal link, app link or deep link to your mobile app where you process the response and asynchronously communicate with your backend service
* alternatively an API endpoint to your backend service where you process the response and redirect back to your application

#### Example
```js
const params = new URLSearchParams(window.location.search);

const error = params.get("error");
if (error) {
  // Handle error response from Auth SDK
  console.log(
    `Auth SDK returned with error type: ${error} and error message: ${params.get("message")}.`
  );
} else {
  const data = JSON.parse(
    decodeURIComponent(params.get("data") || "false")
  );
  // This is the provider object that contains sid that should be used in headers for API requests
  console.log(`Auth SDK returned with provider object: ${data}`);
}
```

### 3. Authenticate and see if it works

After successful authentication you will receive the provider object in the search params of the `redirect` URL.

```js
{
  id: 1,
  name: "nordnet",
  displayName: "Nordnet",
  country: "SWE",
  loginOptions: [{
    loginMethod: "bankid",
    params: [
      {name: "sameDevice", type: "boolean"}
    ],
    iconUrl: "",
  }],
  customer: "Personal",
  providerType: "Neobank",
  iconUrl: "https://gateway-staging.finfollow.com/resources/nordnet.png",
  //You should use this sid in headers for API requests
  sid: "0a2c72e0-9e20-4c99-ac6c-91299623043d",
}
```
### [Examples](examples.html)
