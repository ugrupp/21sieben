// set a scroll class onto the body once the page is scrolled
function setScrollFlag() {
  document.body.classList.add('has-scrolled');
}

function onScroll(evt) {
  if (window.scrollY > 0) {
    requestAnimationFrame(setScrollFlag);
  }
}

window.addEventListener('scroll', onScroll);
