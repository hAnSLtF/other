let gulp = require('gulp');
let less = require('gulp-less');

gulp.task('less', () => {
    gulp.src('app/src/test1/test1.less')
        .pipe(less())
        .pipe(gulp.dest('app/dest'));
});

gulp.task('default', gulp.series('less'));

