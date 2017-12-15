# 21sieben

A neat little onepager for 21sieben web development:
https://www.21sieben.de

## Random facts

* It's a Jekyll site.
* You'll need good stuff like npm, node, gulp and ruby to run it on your machine.
* It's deployed by netlify, using a lot of their cool features (CI, SSL, asset optimization, snippet injection). I'm happy with them, so here's their badge:
[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
* Gulp workflow: Sass, JS (Browserify + Babel), svg icon system, Jekyll build, browsersync, linting etc.
* Y NO 100% on PageSpeed? 😱 Because it's overrated. I decided against critical CSS here for 2,5 reasons:
  * The critical path isn't the CSS, it's the webfonts. The hero animation even waits until you have loaded the CI font before it starts playing. And it's fullscreen. Combine these and above-the-fold optimization becomes pretty useless.
  * I'd rather have non-jerky pageloads below the fold. Especially since you can (and should) link into the content, i.e. https://www.21sieben.de/#skills
  * The site is super fast anyway 😁
* *It all started as a pen*, playing around with anime.js: https://codepen.io/21sieben/pen/YEMwwM

## Authors
yeah ... **Urs Grupp - 21sieben**
