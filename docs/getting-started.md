---
layout: default
title: Getting Started
nav_order: 1
---

# Getting Started

First you need to get your `Primary Token` from [Finsquid](https://www.finsquid.io/contact). Using your Primary Token you should get Temporary Token.

It is **forbidden** to store your Primary Token on the client side so you should use Temporary Token for all API requests from client. However you can use Primary Token on your server in the same way.

## Getting Temporary Access Token

You can get Temporary Token using the `GET v1/token/create` endpoint. The request must be authenticated using your primary token.

Request:
```bash
curl -X GET 'https://gateway-staging.finsquid.io/v1/token/create' \
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
const AUTH_LINK = new URL("https://sdk-staging.finsquid.io/auth");
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
curl -X GET 'https://gateway-staging.finsquid.io/v1/providers' \
-H 'Authorization: Bearer {TEMPORARY_TOKEN}'
```

### [API Documentation](https://gateway-staging.finsquid.io/doc)

## Flow Diagrams

### Auth SDK Flow Diagram
```mermaid
sequenceDiagram;
    Client->>+Server: Authenticate;
    Server->>+Finsquid API: Get Temporary Token using Primary token;
    Finsquid API-->>-Server: Temporary Token;
    Server-->>-Client: Temporary Token;
    Client->>+Auth SDK: Temporary Token;
    Auth SDK-->>-Client: sid;
    Client->>+Finsquid API: Account requests using sid;
    Finsquid API-->>-Client: Account Details;
```

### Manual Flow Diagram
```mermaid
sequenceDiagram;
    Client->>+Server: Authenticate;
    Server->>+Finsquid API: Get Temporary Token using Primary token;
    Finsquid API-->>-Server: Temporary Token;
    Server-->>-Client: Temporary Token;
    Client->>+Finsquid API: Get Providers list;
    Finsquid API-->>-Client: Providers list;
    Client->>+Finsquid API: Bank Init using Login Method from Provider object;
    Finsquid API-->>-Client: Init Status, QR code image/Autostarttoken(depends on login method) and sid;
    Client->>+Finsquid API: Check Bank Init status using sid;
    Finsquid API-->>-Client: Bank Init status;
    Client->>+Finsquid API: After success Init get Useraccounts list;
    Finsquid API-->>-Client: Useraccounts list;
    Client->>+Finsquid API: Select account using accountId;
    Finsquid API-->>-Client: Select status, if success Bank Authentication completed;
    Client->>+Finsquid API: Account requests using sid;
    Finsquid API-->>-Client: Account Details;
```

### Detailed Flow Diagram
[![Flow Diagram](./images/flow-diagram.png)](./images/flow-diagram.png)

### [API Documentation](https://gateway-staging.finsquid.io/doc)