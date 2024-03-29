---
layout: default
title: Customization
nav_order: 4
---

# Customization

You can change theme colors such as:

![Auth color customization](./images/auth-customization.png)
![Aggregate color customization](./images/aggregate-customization.png)

Declaring theme object and encoding it as a URI component.

```js
const theme = {
  colorPrimary: "#7D00FF",
  colorBgLayout: "#F5F7FE",
  colorBgContainer: "#FFFFFF",
  primaryColor: "#FFFFFF",
  defaultColor: "#000000",
  colorText: "#000000",
  colorBgTextHover: "#0000000f",
  defaultBg: "#FFFFFF",
};
```

Append the URL parameter `theme` to your `sdk link`.

```js
const SDK_LINK = new URL(sdkLink);
SDK_LINK.searchParams.set("theme", JSON.stringify(theme));
```

```html
<iframe src="{SDK_LINK}" />;
```

### Radio buttons option

Lists looks as below by default:

![Lists appearance](./images/auth-radio-off.png)

You can change the lists appearance appending URL parameter `radio-buttons=true` to your `sdk link`.

```js
const SDK_LINK = new URL(sdkLink);
SDK_LINK.searchParams.set("radio-buttons", true);
```

```html
<iframe src="{SDK_LINK}" />;
```

Lists will look as below:

![Lists appearance](./images/auth-radio-on.png)
