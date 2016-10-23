var gulp        = require("gulp");
var _uglify     = require("gulp-uglify");
var _concat     = require("gulp-concat");
var _rimraf     = require("rimraf");
var _mkdirp     = require("mkdirp");
var _jsonminify = require("gulp-jsonminify");
var _dom        = require("gulp-dom");
var path        = require("path");
var _htmlmin    = require('gulp-htmlmin');
var _concat     = require('gulp-concat');
var _uglifyjs   = require('gulp-uglifyjs');
var _cleanCSS   = require('gulp-clean-css');
var _gulpCopy   = require('gulp-copy');
var _zip        = require('gulp-zip');

gulp.task("clear", function(done) {
  _rimraf("./dist", function() {
    _mkdirp("./dist", function() {
      done()
    });
  });
});

gulp.task("manifest", function(done) {
  return gulp.src(["manifest.json"])
      .pipe(_jsonminify())
      .pipe(gulp.dest("dist"));
});

function processHtml(src) {
  var dist = path.join("dist", src);

  return gulp.src(src)
    .pipe(_dom(function() {
      var scripts = this.querySelectorAll("script");
      var styles = this.querySelectorAll("link");

      var scriptList = [];
      var styleList = [];

      for (var i in scripts) {
        var script = scripts[i];
        scriptList.push(path.join(path.dirname(src), script.src));
        script.parentNode.removeChild(script);
      }

      for (var i in styles) {
        var style = styles[i];
        styleList.push(path.join(path.dirname(src), style.href));
        style.parentNode.removeChild(style);
      }

      var script = this.createElement("script");
      script.type = "text/javascript";
      script.src = "script.js";
      this.head.appendChild(script);

      var style = this.createElement("link");
      style.rel = "stylesheet";
      style.href = "style.css";
      this.head.appendChild(style);
      
      gulp.src(scriptList)
        // .pipe(_uglifyjs())
        .pipe(_concat("script.js"))
        .pipe(gulp.dest(path.dirname(dist)));

      gulp.src(styleList)
        .pipe(_cleanCSS())
        .pipe(_concat("style.css"))
        .pipe(gulp.dest(path.dirname(dist)));

      return this;
    }))
    .pipe(_htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dirname(dist)));
}

gulp.task("popup", function(done) {
  _mkdirp("./dist/popup", function() {
    processHtml("popup/index.html");
  });
});

gulp.task("options", function(done) {
  _mkdirp("./dist/options", function() {
    processHtml("options/index.html");
    gulp.src("options/*.png")
      .pipe(_gulpCopy("dist"))
  });
});

gulp.task("background", function(done) {
  _mkdirp("./dist/background", function() {
    gulp.src("background/index.js")
      //.pipe(_uglifyjs())
      .pipe(gulp.dest(path.join("dist", "background")));
  });
});

gulp.task("icons", function(done) {
  var icons = [
    "icons/true/wlist_true.png",
    "icons/false/wlist_false_16.png",
    "icons/false/wlist_false_48.png",
    "icons/false/wlist_false_128.png"
  ];

  gulp.src(icons)
    .pipe(_gulpCopy("dist"))
});

gulp.task("compile", ["clear"], function(done) {
  gulp.start("manifest");
  gulp.start("popup");
  gulp.start("options");
  gulp.start("background");
  gulp.start("icons");
  done()
});


gulp.task("compile", ["clear"], function(done) {
  gulp.start("manifest");
  gulp.start("popup");
  gulp.start("options");
  gulp.start("background");
  gulp.start("icons");

  done();
});


gulp.task("zip", function(done) {
  gulp.src(["dist/*", "dist/**/*"])
    .pipe(_zip("firefox.xpi"))
    .pipe(gulp.dest('.'));
});

gulp.task("default", ["compile"]);