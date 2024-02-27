---
layout: default
title: Localization
nav_order: 5
---

# Localization

Finsquid SDK supports English and Swedish languages:

![Auth localization](./images/auth-localization.png)

You can change the language appending URL parameter `lang=sv` to your `sdk link`.

```js
// lang values - 'en' or 'sv'
const lang = "en";
const SDK_LINK = new URL(sdkLink);
SDK_LINK.searchParams.set("lang", lang);
```

```html
<iframe src="{SDK_LINK}" />;
```
