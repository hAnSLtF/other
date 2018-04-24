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
    let consoleMsg = `[${time.grey}] ${'[CssError]'.red} ${e.message.replace(`${e.filename} line no. ${e.lineNumber}`, '').red} ${e.filename.magenta} ${'line no.'.yellow}${e.lineNumber.toString().yellow} ${'column no.'.green}${e.column.toString().green}`;
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
    return gulp.src(['app/src/**/!(_)*.less', '!{build, node_modules}/**'])
        .pipe(less())
        .on('error', errorHandeler)
        .pipe(gulp.dest('app/dest/'));
});

//sass编译
gulp.task('sass', () => {
    return gulp.src(['app/src/**/!(_)*.{sass, scss}', '!{build, node_modules}/**'])
        .pipe(sass())
        .on('error', errorHandeler)
        .pipe(gulp.dest('app/dest/'));
});

//修正浏览器前缀
gulp.task('autofix', () => {
    return gulp.src('app/dest/**/!(_)*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'not ie < 8'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/dest/'));
});

//压缩css
gulp.task('cssmin', () => {
    return gulp.src('app/dest/**/!(_)*.css')
        .pipe(cleanCSS({
            advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            //compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '1'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('app/dest/'));
});

//压缩html
gulp.task('htmlmin', () => {
    let options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(['app/dest/**/!(_)*.html', '!{build, node_modules}/**'])
        .pipe(htmlmin(options))
        .pipe(gulp.dest('app/dest/'));
});

//压缩js
gulp.task('jsmin', function() {
    return gulp.src(['app/src/**/!(_)*.js', '!{build, node_modules}/**'])
        .pipe(uglify({
            mangle: false, //类型：Boolean 默认：true 是否修改变量名
            compress: true //类型：Boolean 默认：true 是否完全压缩
            // preserveComments: 'all' //保留所有注释
        }))
        .on('error', function(e) {
            console.log(JSON.stringify(e));
            this.emit('end');
        })
        .pipe(gulp.dest('app/dest/'));
});

//压缩图片
gulp.task('imagemin', function() {
    return gulp.src('app/src/**/*.{png, jpg, gif ,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('app/dest/'));
});


gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './app/',
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

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './app/',
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
    gulp.watch(['app/dest/**/*'], reload);
    gulp.watch(['app/src/**/!(_)*.{sass, scss}'], gulp.series(['sass', 'autofix', 'cssmin']));
    gulp.watch(['app/src/**/!(_)*.js', '!{build, node_modules}/**'], gulp.series(['jsmin']));
});

gulp.task('default', gulp.series(['serve']));
