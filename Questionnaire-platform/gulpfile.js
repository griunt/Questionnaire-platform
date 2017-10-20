var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    browserSync = require("browser-sync"),
    amdOptimize = require("amd-optimize"),
    rjs = require("gulp-requirejs");

// CSS样式表生成
gulp.task('styles' ,function() {
    return sass('app/SASS/*.scss', {
            style: "compress"
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('app/DIST/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('app/dist/css'))
        .pipe(notify({ message: "Styles task finished" }));
});

// 打包主程序
gulp.task("scripts", function() {
    rjs({
        name:"main",
        baseUrl: "app/JS",
        out: 'index.js'
    })
    .pipe(gulp.dest('app/DIST/js'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/DIST/js'))
    .pipe(notify({ message: "Scripts task complete" }));
});

// 额外打包属于问卷分页
gulp.task("scriptsQ", function() {
    rjs({
        name:"customer",
        baseUrl: "app/JS/qn",
        out: 'cus.js'
    })
    .pipe(gulp.dest('app/DIST/js'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/DIST/js'))
    .pipe(notify({ message: "Scripts of qns task complete" }));
});

// browserSync的使用
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app"
        }
    });
    gulp.watch("./app/**/*.*").on('change', browserSync.reload);
    // 自动刷新页面
    gulp.watch(['app/DIST/**']).on('change', livereload.changed);
});

// 先删除残留
gulp.task('clean', function(cb) {
    del(['app/DIST/css', 'app/DIST/js'], cb);
});

// 监听文件
gulp.task('watch', function() {
    // 监听scss
    gulp.watch("app/DIST/css/*.*", ['styles']);
    // 监听js
    gulp.watch("./app/DIST/js/*.*", ['scripts']);
});

// 默认
gulp.task('default', function() {
    gulp.start('clean');
    gulp.start('styles', 'scripts', 'browser-sync', 'scriptsQ');
});