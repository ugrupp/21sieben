import ScrollReveal from 'scrollreveal';

let sr = ScrollReveal();

// Disable reveal on pageload
// https://github.com/jlmakes/scrollreveal/issues/276
sr.reveal('[data-reveal]', {
  duration: 0,
  afterReveal: function () {
    sr.reveal('[data-reveal]', {
      duration: 750,
      distance: '3em',
      scale: 1,
      //easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // ease-out-back
      afterReveal: function () {}
    })
  }
});
