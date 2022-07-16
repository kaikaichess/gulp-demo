const gulp =require('gulp');

// 1.创建一个打包CSS的任务
gulp.task('cssHandler', function() {
    // 找到源文件
    gulp
        .src('./src/css/*.css')
        .pipe(压缩任务)
        .pipe(gulp.dest('./dist/css/'))
})