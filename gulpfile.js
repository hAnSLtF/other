const gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css')

let path = './app/src/';

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './app/dest/test1/',
            middleware: [
                function (req, res, next) {
                    console.log('refresh');
                    next();
                }
            ]
        },
        port: 3080,
        logPrefix: 'test',
        logFileChanges: true,
        logLevel: 'info',
    });
});

gulp.task('less', () => {
    gulp.src(['app/src/**/*.less', '!app/src/node_modules/**'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'not ie < 8'],
            remove: true
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/dest/'))
});

gulp.task('js', () => {
    gulp.src('app/src/**/*.js')
        .pipe(gulp.dest('app/dest/'))
});


gulp.task('default', gulp.series(['browser-sync', 'less']));

