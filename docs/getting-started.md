---
layout: default
title: Getting Started
nav_order: 1
---

# Getting Started

First you need to get your `Primary Token` from [Finsquid](https://www.finsquid.io/contact). Using your Primary Token you should get Temporary Token.

## Getting Temporary Access Token

You can get Temporary Token using the `GET v1/token/create` endpoint. The request must be authenticated using your primary token.

Request:
```bash
curl -X GET 'https://gateway.finsquid.io/v1/token/create' \
-H 'Authorization: Bearer {PRIMARY_TOKEN}'
```
Response:
```bash
{
  "token": "{TEMPORARY_TOKEN}",
  "expires": 1708550337795
}
```

### You should use this token for SDK links:
```js
const AUTH_LINK = new URL("https://sdk.finsquid.io/auth");
AUTH_LINK.searchParams.set("api_key", TEMPORARY_TOKEN);
AUTH_LINK.searchParams.set("iframe", true);
```
```html
<iframe src="{AUTH_LINK}" />
```
### [Auth SDK Documentation](auth-sdk.html)

### And for all API requests from client.
For instance to get providers list:
```bash
curl -X GET 'https://gateway.finsquid.io/v1/providers' \
-H 'Authorization: Bearer {TEMPORARY_TOKEN}'
```
It is not recommended to store your Primary Token on the client side so you should use Temporary Token for all API requests from client. However you can use Primary Token on your server in the same way.

### [API Documentation](https://gateway.finsquid.io/doc)