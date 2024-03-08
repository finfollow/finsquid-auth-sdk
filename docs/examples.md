---
layout: default
title: Examples
nav_order: 6
---

# Examples

You can use these examples to get started with the Auth SDK.

## Auth SDK Embed in iframe

Just copy/paste the code below in your HTML file and open in the browser.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auth SDK</title>
  </head>
  <body style="margin: 0;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
      <iframe style="width: 100%; height: 100vh; border: none; display: none;"></iframe>
      <div id="result"></div>
      <button onclick="handleConnect()" style="width: 348px; margin-top: 50px; height: 40px; border-radius: 20px; color: #fff; background-color: #7d00ff; box-shadow: 0 2px 0 rgba(165, 5, 255, 0.1); border: 1px solid transparent;">Connect</button>
    </div>
  </body>
  <script>
    const baseUrl = window.location;
    const button = document.querySelector('button');
    const iframe = document.querySelector('iframe');
    const reuslt = document.getElementById('result')
    const apiKey = new URLSearchParams(baseUrl.search).get("api_key");

    if (!apiKey) alert(`Please add your API Key in the url in following format:\n${baseUrl}?api_key=YOUR_API_KEY`);

    function handleConnect() {
      button.style.setProperty('display', 'none');
      const theme = {
        colorPrimary: "#7D00FF",
        colorBgLayout: "#F5F7FE",
        colorBgContainer: "#FFFFFF",
      }
      
      const authSdkLink = new URL("https://sdk-staging.finsquid.io/auth");
      authSdkLink.searchParams.set("api_key", apiKey);
      authSdkLink.searchParams.set("iframe", "true");
      authSdkLink.searchParams.set("theme", JSON.stringify(theme));
      authSdkLink.searchParams.set("lang", "en");
      
      iframe.src = authSdkLink;
      iframe.style.setProperty('display', 'block');
    }

    const handlePostMessage = (event) => {
      // Commented out to enable functionality when opening the HTML file in a browser, should be in place in production
      // if (event.target.origin !== baseUrl.origin) return;
      const { type, data, error } = event.data;

      if (type === "success") {
        console.log("Auth SDK result: ", JSON.stringify(data, null, 2));
        iframe.style.setProperty("display", "none");
        button.style.setProperty("display", "block");
        reuslt.innerHTML = `<h3 style="text-align: center;">Success!</h3><strong>sid:</strong>${data.sid}<p><a href="https://docs.finsquid.io" target=”_blank”>SDK Documentation</a></p><p><a href="https://gateway-staging.finsquid.io/doc" target=”_blank”>API Documentation</a></p>`;
      } else if (type === "error") {
        iframe.style.setProperty("display", "none");
        button.style.setProperty("display", "block");
        alert("Auth SDK error message: " + JSON.stringify(error, null, 2));
      }
    };

    window.addEventListener("message", handlePostMessage);
  </script>
</html>
```

## Auth SDK Redirect

Copy/paste the code below in your HTML file and run it on the local server.

### Run Local Server

* If you have Node.js installed, you can use the http-server package to quickly serve static files.

* First, install http-server globally via npm:
```bash
npm install -g http-server
```

* Then navigate to the directory containing your HTML file in the terminal and run:
```bash
http-server
```
* Your files will be served at http://localhost:8080 by default.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Auth SDK</title>
  </head>
  <body style="margin: 0;">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
      <div id="result"></div>
      <button onclick="handleConnect()" style="width: 348px; margin-top: 50px; height: 40px; border-radius: 20px; color: #fff; background-color: #7d00ff; box-shadow: 0 2px 0 rgba(165, 5, 255, 0.1); border: 1px solid transparent;">Connect</button>
    </div>
  </body>
  <script>
    const baseUrl = window.location;
    const reuslt = document.getElementById('result')
    const apiKey = new URLSearchParams(baseUrl.search).get("api_key");

    if (!apiKey) alert(`Please add your API Key in the url in following format:\n${baseUrl}?api_key=YOUR_API_KEY`);

    function handleConnect() {
      const theme = {
        colorPrimary: "#7D00FF",
        colorBgLayout: "#F5F7FE",
        colorBgContainer: "#FFFFFF",
      }
      
      const authSdkLink = new URL("https://sdk-staging.finsquid.io/auth");
      authSdkLink.searchParams.set("api_key", apiKey);
      authSdkLink.searchParams.set("theme", JSON.stringify(theme));
      authSdkLink.searchParams.set("lang", "en");
      authSdkLink.searchParams.set("redirect", baseUrl);
      
      window.open(authSdkLink, "_self");
    }

    document.addEventListener("DOMContentLoaded", function () {
      const params = new URLSearchParams(baseUrl.search);
      const error = params.get("error");
      if (error) {
        alert(error + '\n' + JSON.stringify(params.get("message"), null, 2));
      } else {
        const data = JSON.parse(
          decodeURIComponent(params.get("data") || "false")
        );
        console.log("data", JSON.stringify(data, null, 2));
        if (data) {
          reuslt.innerHTML = `<h3 style="text-align: center;">Success!</h3><strong>sid:</strong>${data.sid}<p><a href="https://docs.finsquid.io" target=”_blank”>SDK Documentation</a></p><p><a href="https://gateway-staging.finsquid.io/doc" target=”_blank”>API Documentation</a></p>`;
        }
      }
    });

    window.addEventListener("message", handlePostMessage);
  </script>
</html>
```