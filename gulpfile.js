/**
 *
 * 21sieben website gulpfile.js
 *
 */

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var moduleImporter = require('sass-module-importer');
var runSequence = require('run-sequence');
var dotenv = require('dotenv');
var autoprefixer = require('autoprefixer');
var postCssSyntaxScss = require('postcss-scss');
var stylelint = require('stylelint');
var cssnano = require('cssnano');
var reporter = require('postcss-reporter');
var notifier = require('node-notifier');
var path = require('path');
var fs = require('fs');
var browserify = require('browserify');
var envify = require('envify');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var critical = require('critical');


// Setup & Configuration
// ==============================

// Read .env file and store its contents in process.env variable
dotenv.config();

// NODE_ENV, should default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var messages = {
  eleventyBuild: '<span style="color: grey">Running:</span> $ eleventy build'
};

// store all gulp plugins in $
const $ = gulpLoadPlugins();

// Configuration
var config = {};

// base
config.siteName = '21sieben';
config.proxyDomain = process.env.BROWSERSYNC_PROXY_DOMAIN || '21sieben.test';

// destination directories
config.dest = '_site/';
config.destJS = config.dest + 'js';
config.destCSS = config.dest + 'css';
config.destSVG = config.dest + 'images/svg';
config.destIMG = config.dest + 'images/layout';

// destination directories (root)
config.destJSRoot = 'js';
config.destCSSRoot = 'css';
config.destSVGRoot = 'images/svg';
config.destIMGRoot = 'images/layout';

// entry files
config.entries = {
  scss: '_scss/main.scss',
  js: '_js/main.js',
}

// globs
config.globs = {
  scss: '_scss/**/*.scss',
  js: '_js/**/*.js',
  svg: '_images/svg/*.svg',
  img: '_images/layout/**/*',
  eleventy: ['_data/*', '*.html', '.eleventy*', 'static', '_layouts/*.html', '_includes/**/*', '_skills/*',]
};


// Environment handling tasks
// ==============================
gulp.task('set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});


// Notification icons
// ==============================

/**
 * Checks to see if a file exists.
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Get success icon
const iconPathSuccess = path.join(__dirname, 'gulp/icon--success.png');
const iconSuccess = fileExists(iconPathSuccess) ? iconPathSuccess : null;

// Get error icon
const iconPathError = path.join(__dirname, 'gulp/icon--error.png');
const iconError = fileExists(iconPathError) ? iconPathError : null;


// Plumber error handler
// ==============================
function plumberErrorHandler(err) {
  // notify by console log
  $.util.log($.util.colors.white.bgRed("Build error:"), err.message);

  // notify by notification
  notifier.notify({
    title: config.siteName,
    message: 'Build error! "' + err.message + '"',
    icon: iconError
  });

  this.emit('end');
}


// ELEVENTY TASKS
// ==============================

/**
 * Build the Eleventy Site
 */
gulp.task('eleventy-build', function(done) {
  browserSync.notify(messages.eleventyBuild);
  return cp.spawn('npx', ['eleventy'], {
      stdio: 'inherit'
    })
    .on('close', done);
});

/**
 * Rebuild Eleventy & do page reload
 */
gulp.task('eleventy-rebuild', ['eleventy-build'], function() {
  browserSync.reload();
});

/**
 * Wait for eleventy-build, then launch the Server
 */
gulp.task('browser-sync', function() {
  browserSync.init({
    host: config.proxyDomain,
    logSnippet: false,
  });
});


// STYLES TASK
// Compiles files from _scss into /_site/css and /css
// Also does the usual autoprefixer/minify/linting stuff
// ==============================
var postCSSPreProcessors = [
  stylelint(),
  reporter({
    clearReportedMessages: true,
  })
];

var postCSSPostProcessors = [
  autoprefixer(),
  cssnano({
    preset: 'default',
  }),
];

gulp.task('sass', function() {
  return gulp.src(config.entries.scss)
    .pipe($.plumber({
      errorHandler: plumberErrorHandler
    }))
    .pipe($.if(process.env.NODE_ENV === 'development', $.sourcemaps.init()))
    .pipe($.postcss(postCSSPreProcessors, {
      syntax: postCssSyntaxScss
    }))
    .pipe($.sass({
      importer: moduleImporter(),
      outputStyle: ':compact',
      precision: 10
    }))
    .pipe($.postcss(postCSSPostProcessors))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.if(process.env.NODE_ENV === 'development', $.sourcemaps.write('./')))
    .pipe(gulp.dest(config.destCSS))
    .pipe(gulp.dest(config.destCSSRoot))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// SCRIPTS TASK: Babelify, bundle, lint and minify JavaScript.
//
// Note:
// * ES6 is supported
// * that includes ES6 imports via browserify + babelify.
// ==============================

// TODO: Upgrade to babel 7
// TODO: Check babel-polyfill + preset-env

gulp.task('scripts', ['eslint'], function() {
  // log NODE_ENV
  $.util.log('Building scripts with NODE_ENV:', process.env.NODE_ENV);

  return gulp.src(config.entries.js, {
      read: false
    })
    .pipe($.plumber({
      errorHandler: plumberErrorHandler
    }))
    .pipe($.tap(function(file) {
      // browserify inside gulp-tap, so plumbering still works.
      file.contents = browserify({
          entries: [file.path],
          debug: process.env.NODE_ENV === 'development'
        })
        .transform(envify, {
          _: 'purge',
          global: true
        })
        .transform(babelify)
        .bundle();
    }))
    .pipe(buffer()) // converts bundled stream, so it can be further processed
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.if(process.env.NODE_ENV === 'development', $.sourcemaps.init({
      loadMaps: true
    })))
    .pipe($.uglify())
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.if(process.env.NODE_ENV === 'development', $.sourcemaps.write('./')))
    .pipe(gulp.dest(config.destJS))
    .pipe(gulp.dest(config.destJSRoot))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// ESLINT TASK: Lint JavaScript
// ==============================
gulp.task('eslint', function() {
  return gulp.src([config.globs.js])
    .pipe($.eslint())
    .pipe($.eslint.format())
});


// SVG TASK: Create SVG spritemap
// ==============================
gulp.task('svg', function() {
  var svgSpriteConfig = {
    log: 'info',
    svg: {
      namespaceClassnames: false
    },
    mode: {
      symbol: {
        dest: '.',
        sprite: 'sprite.svg'
      }
    }
  };

  return gulp.src(config.globs.svg)
    .pipe($.plumber({
      errorHandler: plumberErrorHandler
    }))
    .pipe($.svgSprite(svgSpriteConfig))
    .pipe(gulp.dest(config.destSVG))
    .pipe(gulp.dest(config.destSVGRoot));
});

/**
 * Rebuild SVGs & do page reload
 */
gulp.task('svg-rebuild', ['svg'], function() {
  browserSync.reload();
});

// IMG TASK: Simply copy images
// ==============================
gulp.task('img', function() {
  return gulp.src(config.globs.img)
    .pipe($.plumber({
      errorHandler: plumberErrorHandler
    }))
    .pipe(gulp.dest(config.destIMG))
    .pipe(gulp.dest(config.destIMGRoot));
});

/**
 * Rebuild images & do page reload
 */
gulp.task('img-rebuild', ['img'], function() {
  browserSync.reload();
});


// WATCH TASK: Watch files for changes
// ==============================
gulp.task('watch', function() {
  // watch all .scss files, recompile SASS
  $.watch(config.globs.scss, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('sass');
  });

  // watch all script files, recompile scripts
  $.watch(config.globs.js, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('scripts');
  });

  // watch all svg files, recompile SVG spritemap
  $.watch(config.globs.svg, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('svg-rebuild');
  });

  // watch all Eleventy files, run Eleventy & reload BrowserSync
  $.watch(config.globs.eleventy, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('eleventy-rebuild');
  });

  // watch all image files, recopy images
  $.watch(config.globs.img, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('img-rebuild');
  });
});


// CRITICAL TASK: Build critical CSS
// ==============================
gulp.task('critical', function () {
  critical.generate({
    inline: true,
    dest: 'critical/',
    src: 'http://' + config.proxyDomain,
    minify: true,
    dimensions: [
      {
        width: 320,
        height: 480,
      },
      {
        width: 1200,
        height: 900,
      }
    ]
  });
});


// DEFAULT TASK: Build files and serve browsersync
// ==============================
gulp.task('default', callback =>
  runSequence(
    ['sass', 'scripts', 'svg', 'img', 'eleventy-build'],
    'browser-sync',
    'watch',
    callback
  )
);


// PRODUCTION TASK: Set NODE_ENV to production and build files
// ==============================
gulp.task('production', callback =>
  runSequence(
    ['set-prod-node-env', 'sass', 'scripts', 'svg', 'img', 'eleventy-build'],
    callback
  )
);
