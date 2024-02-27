---
layout: default
title: Embed in iframe
parent: Auth SDK
nav_order: 2
---

# Auth SDK Embed in iframe

## Integrating iframe

### 1. Configure the URL for the iframe

First you need to get your [Temporary Token](getting-started.html). After you have it append the URL parameter `api_key=${TEMPORARY_TOKEN}` and the URL parameter `iframe=true` to your `authentication link`. This will make sure that the response message is sent via `postMessage` to the parent window.

```js
const AUTH_LINK = new URL("https://sdk.finsquid.io/auth");
AUTH_LINK.searchParams.set("api_key", TEMPORARY_TOKEN);
AUTH_LINK.searchParams.set("iframe", true);
```

### 2. Add the URL to an iframe element

Add the `authentication link` as the `src` parameter of an `<iframe>` HTML element.

```html
<iframe src="{AUTH_LINK}" />;
```

An iframe will by default be 300px wide and 150px tall. To allow the iframe to seamlessly adapt its size to the containing element, make sure to apply appropriate sizing either by css or inline-styles. Using the width attribute will give the iframe a static width, which is not recommended when targeting mobile devices.

```html
<!-- ❌ not recommended for mobile devices -->
<iframe src="{AUTH_LINK}" width="400" />

<!-- ✅ adapt to the size of the parent element -->
<iframe src="{AUTH_LINK}" style="width:100%;" />
```

### 3. Add a listener to your app

All communication between an iframed Finsquid Auth and the parent host is done via postMessage. Register a listener to start receiving messages. How you do this is up to you, but the code below shows the basics.

```js
window.addEventListener("message", handlePostMessage);

const handlePostMessage = (event: any) => {
  if (event.origin !== AUTH_LINK.origin) return;

  const { type, data, error } = JSON.parse(event.data);

  if (type === "success") {
    // This is the provider object that contains sid that should be used in headers for API requests
    console.log(`Auth SDK returned with provider object: ${data}`);
  } else if (type === "error") {
    // Handle error response from Auth SDK
    console.log(
      `Auth SDK returned with error type: ${error.type} and error message: ${error.message}.`
    );
  }
};
```

Also, as with all web development, make sure to take the necessary security precautions. You can read more about `postMessage` [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

### 4. Authenticate and see if it works

Go through the authentication inside the integrated iframe flow. If all is successful, you should receive the provider object.

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

## Reference

If you integrate Finsquid Auth in your application via an `iframe`, the result will be delivered as JSON object via `postMessage` to the parent window.

### [Examples](examples.html)