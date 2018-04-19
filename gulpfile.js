const gulp = require('gulp'),
    notify = require('gulp-notify'), //报错处理
    colors = require('colors'), //console颜色
    moment = require('moment'), //时间
    notifier = require('node-notifier'),
    del = require('del'), //删除文件或文件夹
    less = require('gulp-less'), //编译less
    sass = require('gulp-sass'), //编译sass
    browserSync = require('browser-sync'), //实时刷新
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'), // sourcemaps
    autoprefixer = require('gulp-autoprefixer'), //处理浏览器前缀
    cleanCSS = require('gulp-clean-css'), //css压缩
    htmlmin = require('gulp-htmlmin'), //压缩HTML
    imagemin = require('gulp-imagemin'), //压缩图片
    pngquant = require('imagemin-pngquant'), //图片深度压缩
    uglify = require('gulp-uglify'); //js压缩

let path = './app/src/';

let errorHandeler = function(e) {
    let time = moment().format('HH:mm:ss');
    notifier.notify({
        title: 'error',
        message: e.message,
        icon: './assets/gulp-error.png'
    },
    function() {
        console.log(`[${time.grey}] ${'[error]'.red} ${e.message}`);
    });
    this.emit('end');
};

//less编译
gulp.task('less', () => {
    return gulp.src(['app/src/**/*.less', '!app/src/node_modules/**'])
        .pipe(less())
        .on('error', errorHandeler)
        .pipe(gulp.dest('app/dest/'));
});

//sass编译
gulp.task('sass', () => {
    return gulp.src(['app/src/**/*.sass', 'app/src/**/*.scss', '!app/src/node_modules/**'])
        .pipe(sass())
        .on('error', errorHandeler)
        .pipe(gulp.dest('app/dest/'));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './app/dest/test1/',
            middleware: [
                function(req, res, next) {
                    console.log('refresh');
                    next();
                }
            ]
        },
        port: 3080,
        logPrefix: 'test',
        logFileChanges: true,
        logLevel: 'info'
    });
});

// gulp.task('less', () => {
//     gulp.src(['app/src/**/*.less', '!app/src/node_modules/**'])
//         .pipe(sourcemaps.init())
//         .pipe(less())
//         .pipe(autoprefixer({
//             browsers: ['> 1%', 'last 2 versions', 'not ie < 8'],
//             remove: true
//         }))
//         .pipe(cleanCSS())
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('app/dest/'));
// });

gulp.task('js', () => {
    gulp.src('app/src/**/*.js')
        .pipe(gulp.dest('app/dest/'));
});


gulp.task('default', gulp.series(['browser-sync']));

