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

//报错处理
let errorHandeler = function(e) {
    let time = moment().format('HH:mm:ss');
    let consoleMsg = `[${time.grey}] ${'[error]'.red} ${e.message.replace(`${e.filename} line no. ${e.lineNumber}`, '').red} ${e.filename.magenta} ${'line no.'.yellow}${e.lineNumber.toString().yellow} ${'column no.'.green}${e.column.toString().green}`;
    notifier.notify({
        title: 'error',
        message: e.message,
        icon: './assets/gulp-error.png'
    },
    function() {
        console.log(consoleMsg);
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

gulp.task('autofix', () => {
    return gulp.src('app/dest/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sourcemaps.write('.'))
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


gulp.task('js', () => {
    gulp.src('app/src/**/*.js')
        .pipe(gulp.dest('app/dest/'));
});


gulp.task('default', gulp.series(['browser-sync']));

