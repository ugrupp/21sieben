/**
 *
 * FRED gulpfile.js
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


// Setup & Configuration
// ==============================

// Read .env file and store its contents in process.env variable
dotenv.config();

// get jekyll comand
var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// store all gulp plugins in $
const $ = gulpLoadPlugins();

// Configuration
var config = {};

// base
config.siteName = 'FRED';
config.proxyDomain = process.env.BROWSERSYNC_PROXY_DOMAIN || 'fred.dev';

// destination directories
config.dest = '_site/';
config.destJS = config.dest + 'js';
config.destCSS = config.dest + 'css';
config.destCSSRoot = 'css';

// entry files
config.entries = {
  scss: '_scss/main.scss',
  js: '_js/main.js',
}

// globs
config.globs = {
  scss: '_scss/**/*.scss',
  js: '_js/**/*.js',
  jekyll: ['*.html', '_layouts/*.html', '_posts/*']
};


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


// JEKYLL TASKS
// ==============================

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn(jekyll, ['build'], {
      stdio: 'inherit'
    })
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
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
    .pipe($.sourcemaps.init())
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
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.destCSS))
    .pipe(gulp.dest(config.destCSSRoot))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// WATCH TASK: Watch files for changes
// ==============================
gulp.task('watch', function() {
  // watch all .scss files, recompile SASS
  $.watch(config.globs.scss, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('sass');
  });

  // watch all jekyll files, run jekyll & reload BrowserSync
  $.watch(config.globs.jekyll, function(vinyl) {
    $.util.log($.util.colors.underline('\nFile changed: ' + vinyl.relative));
    gulp.start('jekyll-rebuild');
  });
});


// DEFAULT TASK: Build files and serve browsersync
// ==============================
gulp.task('default', callback =>
  runSequence(
    ['sass', 'jekyll-build'],
    'browser-sync',
    'watch',
    callback
  )
);


// PRODUCTION TASK: Just build files
// ==============================
gulp.task('production', callback =>
  runSequence(
    ['sass', 'jekyll-build'],
    callback
  )
);
