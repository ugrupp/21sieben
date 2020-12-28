const markdownIt = require('markdown-it');
const attrs = require('markdown-it-attrs');

const md = new markdownIt({
  typographer: true
})
md.use(attrs);

module.exports = function(config) {
  config.addPassthroughCopy({ "static": "./" });

  config.setLibrary('md', md);
  config.addFilter('markdownify', (str) => {
    return md.render(str)
  })

  config.addCollection("skills", (collection) =>
    collection.getFilteredByGlob("_skills/*.md").sort((a, b) => {
      if (a.fileSlug > b.fileSlug) return 1;
      else if (a.fileSlug < b.fileSlug) return -1;
      else return 0;
    })
  );

  return {
    dir: {
      layouts: "_layouts"
    }
  }
};
