const gulp = require('gulp');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const del = require('del');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('clean', function (done) {
    return del(['build']);
});

gulp.task('electron', ['clean'], function () {
    return gulp.src('src/electron/*.js', {
        base: 'src/'
    })
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('development', ['clean'], function () {
    return browserify({
        entries: './src/app/development/components/DevelopmentComponent.jsx',
        extensions: ['.jsx'],
        debug: true
    })
        .transform('babelify', { presets: ['es2015', 'react'] })
        .bundle()
        .pipe(source('devcomp.js'))
        .pipe(gulp.dest('build/app/development'));
});

gulp.task('pug', ['clean'], function () {
    return gulp.src('src/**/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'));
});

gulp.task('sass', ['clean'], function () {
    return gulp.src('src/**/*.sass')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                'bower_components/bootstrap-sass/assets/stylesheets',
                'bower_components/font-awesome-sass/assets/stylesheets',
                'bower_components/bootstrap-sass/assets/stylesheets'
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest('build'));
});

gulp.task('font-awesome-icons', ['clean'], function () {
    return gulp.src('./bower_components/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./build/app/fonts/font-awesome'));
});

gulp.task('emulator-assets', ['clean'], function () {
    return gulp.src('./src/app/emulator/assets/**.*')
        .pipe(gulp.dest('./build/app/emulator/assets'));
});

gulp.task('default', [
    'electron',
    'development',
    'emulator-assets',
    'pug',
    'sass',
    'font-awesome-icons'
]);
