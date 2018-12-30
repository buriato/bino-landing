const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const sourcemaps = require("gulp-sourcemaps");

const cssunit = require("gulp-css-unit");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const fs = require("fs");
const replace = require('gulp-replace');
const del = require("del");

// images
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const imagemin = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');

// webpack
const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const paths = {
  root: "./build",
  templates: {
    pages: "src/templates/pages/*.pug",
    src: "src/templates/**/*.pug"
  },
  styles: {
    src: "src/styles/**/*.sass",
    dest: "build/assets/styles"
  },
  images: {
    src: "src/images/**/*.{png,jpg}",
    dest: "build/assets/images/"
  },
  fonts: {
    src: "src/fonts/**/*.*",
    dest: "build/assets/fonts/"
  },

  scripts: {
    src: "src/scripts/**/*.js",
    dest: "build/assets/scripts"
  }
};

//pug

function templates() {
  return gulp
    .src(paths.templates.pages)
    .pipe(
      pug({
        pretty: false
      })
    )
    .on(
      "error",
      notify.onError(function (error) {
        return {
          title: "Pug",
          message: error.message
        };
      })
    )
    .pipe(gulp.dest(paths.root));
}

//sass

function styles() {
  return gulp
    .src("./src/styles/app.sass")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed"
      })
    )
    .on("error", notify.onError())
    .pipe(
      cssunit({
        type: "px-to-rem",
        rootSize: 16
      })
    )
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(sourcemaps.write())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(paths.styles.dest));
}

// images

function images() {
  return gulp.src(paths.images.src)
    .pipe(imagemin([
      imagemin.jpegtran({
        progressive: true
      }),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality: 'medium'
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      pngquant({
        quality: '65-70',
        speed: 5
      })
    ]))
    .pipe(gulp.dest(paths.images.dest));
}

function svg() {
  return gulp
    .src('./src/images/icons/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg"
        }
      }
    }))
    .pipe(gulp.dest('./build/assets/images/icons/'));
}

//clean

function clean() {
  return del(paths.root);
}

//webpack

function scripts() {
  return gulp
    .src("src/scripts/app.js")
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

//watcher

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

//server

function server() {
  browserSync.init({
    server: paths.root,
    open: false
  });
  browserSync.watch(paths.root + "/**/*.*", browserSync.reload);
}

//move fonts

function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}


//move images

//function images() {
//  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
//}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.svg = svg;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, templates, images, svg, fonts, scripts),
    gulp.parallel(watch, server)
  )
);

gulp.task(
  "build",
  gulp.series(
    clean,
    gulp.parallel(styles, templates, images, svg, fonts, scripts)
  )
);