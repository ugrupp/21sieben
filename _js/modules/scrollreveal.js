import scrollReveal from 'scrollreveal';

let sr = scrollReveal();

// Disable reveal on pageload
// https://github.com/jlmakes/scrollreveal/issues/276
sr.reveal('[data-reveal]', {
  duration: 0,
  afterReveal() {
    sr.reveal('[data-reveal]', {
      duration: 750,
      distance: '3em',
      scale: 1,
      mobile: false,
      afterReveal() {},
    });
  },
});
