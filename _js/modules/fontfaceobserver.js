import FontFaceObserver from 'fontfaceobserver';

// Body fonts (Lato)
let fontsBody = [
  new FontFaceObserver('Lato', {
    weight: 400,
    style: 'normal',
  }),
  new FontFaceObserver('Lato', {
    weight: 700,
    style: 'normal',
  }),
  new FontFaceObserver('Lato', {
    weight: 900,
    style: 'normal',
  }),
];

// Load our fonts asynchronously
let fontsBodyLoadedPromises = fontsBody.map((fontFaceObserverObj) => {
  // timeout: 5s
  return fontFaceObserverObj.load(null, 5000);
});

// As soon as the fonts are loaded, set a body flag
Promise.all(fontsBodyLoadedPromises).then(() => {
  document.body.classList.add('has-loaded-fonts-body');
});


function triggerFontCIEvent(hasLoaded) {
  let event;
  event = document.createEvent('HTMLEvents');
  event.initEvent(hasLoaded ? 'font-ci-loaded' : 'font-ci-timed-out', true, true);
  document.dispatchEvent(event);
}

// CI font (Alfa Slab One)
new FontFaceObserver('Alfa Slab One', {
  weight: 400,
  style: 'normal',
})
  .load(null, 7000)
  .then(() => {
    // font available, set body class
    document.body.classList.add('has-loaded-fonts-ci');

    // trigger splash animation
    triggerFontCIEvent(true);
  }, () => {
    // font not available, trigger animation anyway (with Impact 🤓)
    triggerFontCIEvent(false);
  });
