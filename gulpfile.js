"use strict";

var tempdir = './',
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    minify = require('gulp-minify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    beautify = require('gulp-beautify-code'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    partial = require('gulp-inject-partials'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

var autoprefixerBrowsers = [
    "last 4 version",
    "> 1%",
    "ie >= 9",
    "ie_mob >= 10",
    "ff >= 30",
    "chrome >= 34",
    "safari >= 7",
    "opera >= 23",
    "ios >= 7",
    "android >= 4",
    "bb >= 10"
];


/*--------------------------------------
    Gulp Custom Notifier
----------------------------------------*/
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
            sound: "Glass"
        })
    });
}


/*---------------------------
    Gulp Clean App Folder
----------------------------*/
gulp.task('ca', function cleanApp(done) {
    gulp.src('./app')
        .pipe(customPlumber('Error On Clean App'))
        .pipe(clean());
    done();
});


/*--------------------------------------
    Gulp Image Copy from source to app
----------------------------------------*/
function imgCopy(done) {
    gulp.src('src/img/**/*')
        .pipe(customPlumber('Error On Copy Images'))
        .pipe(gulp.dest('app/assets/img'));
    done();
}


/*--------------------------------------
    Gulp Fonts Copy from source to app
----------------------------------------*/
function fontsCopy(done) {
    gulp.src('src/fonts/**/*')
        .pipe(customPlumber('Error On Copy Fonts'))
        .pipe(gulp.dest('app/assets/fonts'));
    done();
}


/*--------------------------------------
    Gulp Revslider Resource Copy
----------------------------------------*/
function revSlider(done) {
    gulp.src('src/js/revslider/**/*')
        .pipe(customPlumber('Error On Copy RevSlider'))
        .pipe(gulp.dest('app/assets/js/revslider'));
    done();
}


/*--------------------------------------
    Gulp Php Resource Copy
----------------------------------------*/
function phpCopy(done) {
    gulp.src('src/php/**/*')
        .pipe(customPlumber('Error On Copy Php'))
        .pipe(gulp.dest('app/assets/php'));
    done();
}


/*--------------------------------
    Gulp Vendor Css Make Task
----------------------------------*/
var separator = '\n\n/*====================================*/\n\n';

function vendorCss(done) {
    gulp.src('src/css/**/*')
        .pipe(customPlumber('Error On Make Vendor CSS'))
        .pipe(concat('vendor.css', {newLine: separator}))
        .pipe(gulp.dest('app/assets/css'));
    done();
}


/*------------------------------------------
    Gulp Compile Scss to Css Task & Minify
-------------------------------------------*/
function css(done) {
    var scssFiles = [
        'src/scss/style.scss'
    ];
    done();
    gulp.src(scssFiles)
        .pipe(customPlumber('Error On Compile SCSS'))
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer(autoprefixerBrowsers))
        .pipe(beautify())
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/assets/css'));
}


/*--------------------------------------
    Gulp Compile Helper Scss
----------------------------------------*/
gulp.task("helperCss", function helperCss(done) {
    gulp.src('src/scss/utilities/helper.scss')
        .pipe(customPlumber('Error On Helper Compile'))
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoprefixer(autoprefixerBrowsers))
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/css'));
    done();
});


/*--------------------------------
    Gulp Vendor JS Make Task
----------------------------------*/
function vendorJs(done) {
    gulp.src('src/js/vendor/**/*')
        .pipe(customPlumber('Error On Make Vendor JS'))
        .pipe(concat('vendor.js', {newLine: separator}))
        .pipe(gulp.dest('app/assets/js'));
    done();
}

/*--------------------------------
    Gulp Main Js Minify Task
----------------------------------*/
function jsMinify(done) {
    gulp.src('src/js/active.js')
        .pipe(customPlumber('Error On Minify JS'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('app/assets/js'));
    done();
}


/*--------------------------------------
    Gulp Html Compile Task
----------------------------------------*/
function cleanHtml(done) {
    gulp.src('app/*.html')
        .pipe(customPlumber('Error On clean Html'))
        .pipe(clean());
    done();
}

function compileHtml(done) {
    gulp.src('src/*.html')
        .pipe(customPlumber('Error On Compile Html'))
        .pipe(partial({
            removeTags: true
        }))
        .pipe(beautify())
        .pipe(gulp.dest('app'));
    done();
}

gulp.task('html', gulp.series(cleanHtml, compileHtml));


/*--------------------------------
    Gulp Liver Server Task
----------------------------------*/
function livereload(done) {
    browserSync.init({
        server: {
            baseDir: tempdir + 'app/'
        }
    });
    done();
}


/*--------------------------------
    Gulp Auto Reload Task
----------------------------------*/
function reload(done) {
    browserSync.reload();
    done();
}


/*--------------------------------
    Gulp Files Watch Task
----------------------------------*/
function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series('html', reload));
    gulp.watch('src/scss/**/*', gulp.series(css, reload));
    gulp.watch('src/img/**/*', gulp.series(imgCopy, reload));
    gulp.watch('src/css/**/*', gulp.series(vendorCss, reload));
    gulp.watch('src/js/vendor/**/*', gulp.series(vendorJs, reload));
    gulp.watch('src/js/*.js', gulp.series(jsMinify, reload));
    gulp.watch('src/js/revslider/**/*.js', gulp.series(revSlider, reload));
    gulp.watch('src/fonts/**/*', gulp.series(fontsCopy, reload));
    gulp.watch('src/php/**/*', gulp.series(phpCopy, reload));
}


// Gulp All Files Copy Task to app
gulp.task('filesCopy', gulp.parallel(imgCopy, fontsCopy, css, revSlider, phpCopy, 'html'));


// Gulp CSS, JS Vendor & Minify Task
gulp.task('vendor', gulp.series(vendorCss, vendorJs, jsMinify));


// Gulp Default Task Run On Terminal
gulp.task('default', gulp.series('filesCopy', 'vendor', gulp.parallel(livereload, watchFiles)));