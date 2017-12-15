import Colcade from 'colcade';

var masonry = document.querySelector('[data-masonry-grid]');
if (masonry) {
  new Colcade(masonry, {
    columns: '[data-masonry-col]',
    items: '[data-masonry-item]',
  });
}
