/* jshint esversion: 6 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('clean', function (done) {
    return del(['build']);
});

gulp.task('electron', ['clean'], function () {
    return gulp.src('src/electron/*.js', { base: 'src/' })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('pug', ['clean'], function () {
    return gulp.src('src/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['electron', 'pug']);
