import anime from 'animejs';

// Claim animation
// get claim element (only supports 1 claim right now)
let claimEl = document.querySelector('.claim');
let menuEl = document.querySelector('.menu');
let heidiEl = document.querySelector('.heidi');

if (claimEl) {
  // Preparation: wrap every letter in a span
  Array.from(claimEl.querySelectorAll('.claim__text')).forEach((el) => {
    el.innerHTML = el.innerHTML.replace(/([^\s])/g, '<span class="claim__letter">$&</span>');
  });

  // animation durations
  const lineDuration = 500;
  const animDurationBg = lineDuration;
  const animDurationLetters = 1300;
  const animDelayLetters = 45;
  const animDurationDot = 500;
  const animDurationMenu = 400;
  const easingBg = 'Sine';

  // init claim timeline
  let claimTimeline = anime.timeline({
    autoplay: false,
  }).add({
    begin() {
      claimEl.classList.add('claim--triggered');
    },
  });

  // loop through lines, adding them to the animation timeline
  Array.from(document.querySelectorAll('.claim__line')).forEach((el, idx) => {
    let letters = el.querySelectorAll('.claim__letter');
    let bg = el.querySelectorAll('.claim__background');
    let dot = el.querySelectorAll('.claim__dot');
    let avatar = el.querySelectorAll('.claim__avatar');

    claimTimeline.add({
      targets: letters,
      rotateY: [-90, 0],
      duration: animDurationLetters,
      delay: (el, i, l) => (i + 4) * animDelayLetters,
      offset: lineDuration * idx,
    }).add({
      targets: bg,
      scaleX: [0, 1],
      transformOrigin: ['0 0 0', '0 0 0'],
      easing: `easeIn${easingBg}`,
      duration: animDurationBg,
      offset: lineDuration * idx,
    }).add({
      targets: bg,
      scaleX: 0,
      transformOrigin: ['100% 0 0', '100% 0 0'],
      easing: `easeOut${easingBg}`,
      duration: animDurationBg,
      offset: animDurationBg * (idx + 1),
    }).add({
      targets: dot,
      translateY: ['-50%', 0],
      opacity: [0, 1],
      duration: animDurationDot,
      offset: animDurationBg * (idx + 2),
    }).add({
      targets: avatar,
      translateY: [0, '-30%'],
      rotate: [-30, 0],
      opacity: [0, 1],
      duration: animDurationDot,
      offset: animDurationBg * (idx + 2),
    });
  });

  // fade in heidi
  claimTimeline.add({
    targets: heidiEl,
    translateX: ['-10%', 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: animDurationMenu,
    begin() {
      heidiEl.classList.add('heidi--visible');
    },
  });

  // fade in menu
  claimTimeline.add({
    targets: menuEl,
    translateX: ['10%', 0],
    opacity: [0, 1],
    easing: 'easeOutCubic',
    duration: animDurationMenu,
    begin() {
      menuEl.classList.add('menu--visible');
    },
  });

  // animation complete => set body flag
  claimTimeline.add({
    targets: document.body,
    duration: 1,
    complete() {
      document.body.classList.add('is-splash-finished');
    },
  });


  // Logo animation
  // get elements
  let logoEl = document.querySelector('.logo');
  let splashEl = document.querySelector('.splash');
  let splashBgEl = document.querySelector('.splash__bg-gradient');

  let splashDurationIn = 1000;
  let splashDurationOut = 600;
  let logoDurationIn = 700;
  let logoHoldIn = 2000;
  let logoDurationOut = 800;

  // init logo timeline
  let logoTimeline = anime.timeline({
    autoplay: false,
  }).add({
    begin() {
      splashEl.classList.add('splash--triggered');
      logoEl.classList.add('logo--triggered');
    },
  }).add({
    targets: splashBgEl,
    opacity: [0, 1],
    easing: 'easeInCubic',
    duration: splashDurationIn + 300,
    offset: 0,
  }).add({
    targets: logoEl,
    duration: logoDurationIn,
    scale: [.6, 1],
    translateY: ['-60%', 0],
    opacity: [0, 1],
    easing: 'easeInExpo',
    offset: splashDurationIn,
  }).add({
    targets: logoEl,
    duration: logoHoldIn,
    scale: 1.1,
    easing: 'linear',
    offset: splashDurationIn + logoDurationIn,
  }).add({
    targets: logoEl,
    scale: 3,
    translateX: '100%',
    rotateY: -90,
    opacity: 0,
    easing: 'easeInExpo',
    duration: logoDurationOut,
    offset: splashDurationIn + logoDurationIn + logoHoldIn,
    complete() {
      // chain logo and claim timelines
      claimTimeline.restart();
    },
  }).add({
    targets: splashBgEl,
    opacity: 0,
    easing: 'easeInQuad',
    duration: splashDurationOut,
    offset: splashDurationIn + logoDurationIn + logoHoldIn,
  });

  // play logo timeline once CI font has loaded or timed out
  document.addEventListener('font-ci-loaded', logoTimeline.play, false);
  document.addEventListener('font-ci-timed-out', logoTimeline.play, false);
}

