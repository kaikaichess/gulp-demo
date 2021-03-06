/*
    执行gulp配置文件需要在gulpfile.js文件目录下执行命令 $ gulp 任务名称 
*/

const gulp = require('gulp');
const cssmin = require('gulp-cssmin')
const autoPrefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('node-sass'))
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const webserver = require('gulp-webserver')
const fileInclude = require('gulp-file-include')

// 创建一个打包CSS的任务，gulp3的写法 
// gulp.task('cssHandler', function() {
//     // 如果要捕获该任务的结束，需要把这个流 return 出去，task就会处理流
//     return gulp
//         // 找到源文件
//         .src('./src/css/*.css')
//         // 进行转码
//         .pipe(autoPrefixer())
//         // 压缩文件
//         .pipe(cssmin())
//         // 把文件放到指定目录下
//         .pipe(gulp.dest('./dist/css/'));
// })

// 创建一个打包CSS的任务，gulp4的写法
const cssHandler = function() {
    return gulp
        .src('./src/css/*.css')
        .pipe(autoPrefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/css/'));
}
// 导出这个任务，必须要导出，否则无法执行
module.exports.cssHandler = cssHandler

// 创建一个打包SASS的任务
const sassHandler = function() {
    return gulp
        .src('./src/sass/*.scss')
        // 将sass文件转换成css文件
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/sass/'));
}
module.exports.sassHandler = sassHandler

// 创建一个打包JS的任务
const jsHandler = function() {
    return gulp
        .src('./src/js/*.js')
        // 转换成es5
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // 压缩JS文件
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
}
module.exports.jsHandler = jsHandler

// 创建一个打包JS的任务
const htmlHandler = function() {
    return gulp
        .src('./src/html/*.html')
        .pipe(fileInclude({ // 根据配置导入对应的html片段
            prefix: '@-@', // 自定义的标识符
            basepath: './src/components', // 基准目录，你的组件都在哪一个目录里
        }))
        .pipe(htmlmin({ // 通过配置的参数来决定压缩什么东西
            collapseWhitespace: true, // 移除空格、换行
            removeEmptyAttributes: true, // 移除空属性(仅限于原生属性)
            collapseBooleanAttributes: true, // 移除布尔值属性值，比如checked="checked"变成checked
            removeAttributeQuotes: true, // 移除属性值的引号
            minifyCSS: true, // 对html中内联样式的css进行压缩(只是基本压缩，无法添加前缀)
            minifyJS: true, // 对html中内联样式的js进行压缩(只是基本压缩，无法进行es6转es5)
            removeStyleLinkTypeAttributes: true, // 移除style标签和link标签上的type属性
            removeScriptTypeAttributes: true, // 移除style标签上的type属性
        }))
        .pipe(gulp.dest('./dist/html/'));
}
module.exports.htmlHandler = htmlHandler()

// 创建一个打包images的任务
const imgHandler = function() {
    // 在开发环境中。图片是不需要我们压缩的，我们使用的图片大部分是URL地址或UI处理好的，所以图片我们一般不做处理
    return gulp
    .src('./src/img/**')
    .pipe(gulp.dest('./dist/img/'));
}
module.exports.imgHandler = imgHandler

// 创建一个打包videos的任务
const videoHandler = function() {
    // 同images，video在开发环境中。也是不需要我们压缩的
    return gulp
    .src('./src/video/**')
    .pipe(gulp.dest('./dist/video/'));
}
module.exports.videoHandler = videoHandler

// 创建一个打包audio的任务
const audioHandler = function() {
    // 同images，audio在开发环境中。也是不需要我们压缩的
    return gulp
    .src('./src/audio/**')
    .pipe(gulp.dest('./dist/audio/'));
}
module.exports.audioHandler = audioHandler

// 创建一个打包第三方的任务
const libHandler = function() {
    // 同images，lib在开发环境中。也是不需要我们处理的
    return gulp
    .src('./src/lib/**/*')
    .pipe(gulp.dest('./dist/lib/'));
}
module.exports.libHandler = libHandler

// 创建一个打包fonts的任务
const fontsHandler = function() {
    // 同images，fonts在开发环境中。也是不需要我们处理的
    return gulp
    .src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'));
}
module.exports.fontsHandler = fontsHandler

// 创建一个删除dist目录的任务
const delHandler = function() {
    // del直接执行就可以，不需要流，参数以数组的形式传递
    return del(['./dist/'])
}
module.exports.delHandler = delHandler

// 创建一个启动服务器的任务
const webHandler = function() {
    return gulp
    .src('./dist')
    .pipe(webserver({
        host: 'localhost', // 配置自定义域名
        port: '8080', // 端口号
        livereload: true, // 当文件修改时是否自动刷新页面
        open: './html/index.html', // 默认打开哪一个文件（从dist目录下开始书写）
        // proxies: [ // 配置所有的代理
        //     // 每个代理都是一个对象数据类型，注意，若没有代理则不要写空对象
        //     {
        //         source: '', // 代理标识符
        //         target: '' // 代理目标地址
        //     }
        // ]
    }))
}
module.exports.webHandler = webHandler

// 创建一个监控任务，监控src下的文件是否有变化
const watchHandler = function() { 
    gulp.watch('./src/html/*.html', htmlHandler),
    gulp.watch('./src/css/*.css', cssHandler),
    gulp.watch('./src/sass/*.scss', sassHandler),
    gulp.watch('./src/js/*.js', jsHandler)
}
module.exports.watchHandler = watchHandler

/*
    配置一个默认任务，把所有的任务一起执行，通过gulp.series()或gulp.parallel()执行，这两个方法的返回值是一个函数
    我们可以使用task的方式创建一个default任务
    方式1：gulp.task('default', () => {})
    方式2：module.exports.default = () => {}
    默认任务一定要叫default，因为这样可以直接通过 gulp 指令调用，从而省略了任务名
*/ 

// 创建一个默认任务
// module.exports.default = gulp.parallel(cssHandler, sassHandler, jsHandler, htmlHandler, imgHandler, videoHandler, audioHandler, libHandler,fontsHandler)
module.exports.default = gulp.series( // gulp.parallel是并行执行任务，所以不确定哪个任务会先结束，所以要用gulp.series
    delHandler,
    gulp.parallel(cssHandler, sassHandler, jsHandler, htmlHandler, imgHandler, videoHandler, audioHandler, libHandler,fontsHandler),
    webHandler, // 启动服务器
    watchHandler
)