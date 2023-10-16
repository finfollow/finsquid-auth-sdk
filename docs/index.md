---
layout: default
title: Finsquid Auth SDK for Web
nav_order: 2
---

Finsquid Auth is our front-end web SDK for account authentication.

![ Auth SDK Preview ](./images/01.png)

Please refer to our product page for more information about [Finsquid](https://www.finsquid.io).

And [how it works](https://www.finsquid.io/how-it-works).

## [Getting started](./docs/getting-started.md)

<button class="btn js-toggle-dark-mode">Preview dark color scheme</button>

<script>
const toggleDarkMode = document.querySelector('.js-toggle-dark-mode');

jtd.addEvent(toggleDarkMode, 'click', function(){
  if (jtd.getTheme() === 'dark') {
    jtd.setTheme('light');
    toggleDarkMode.textContent = 'Preview dark color scheme';
  } else {
    jtd.setTheme('dark');
    toggleDarkMode.textContent = 'Return to the light side';
  }
});
</script>
