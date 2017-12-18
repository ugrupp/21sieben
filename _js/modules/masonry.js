import Colcade from 'colcade';

let masonry = document.querySelector('[data-masonry-grid]');
if (masonry) {
  new Colcade(masonry, {
    columns: '[data-masonry-col]',
    items: '[data-masonry-item]',
  });
}
