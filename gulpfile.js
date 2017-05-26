var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');

gulp.task('default', function(){
    var b = browserify({
        entries: './js/main.js',
        debug: true,
        transform: [babelify.configure({
            presets: ['es2015']
        })]
    });

    return b.bundle()
        .pipe(source('./build.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .on('error', util.log)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public'));
});



gulp.watch('./js/**/*.js', function(){
    gulp.start('default');
});
