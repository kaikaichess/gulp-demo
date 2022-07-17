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

// 1.创建一个打包CSS的任务，gulp3的写法 
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

// 1.创建一个打包CSS的任务，gulp4的写法
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
        .pipe(htmlmin({ // 通过配置的参数来决定压缩什么东西
            collapseWhitespace: true, // 移除空格、换行
            removeEmptyAttributes: true, // 移除空属性(仅限于原生属性)
            collapseBooleanAttributes: true, // 移除布尔值属性值，比如checked="checked"变成checked
            removeAttributeQuotes: true, // 移除属性值的引号
            minifyCSS: true, // 对html中内联样式的css进行压缩(只是基本压缩，无法添加前缀)
            minifyJS: true, // 对html中内联样式的js进行压缩(只是基本压缩，无法进行es6转es5)
        }))
        .pipe(gulp.dest('./dist/html/'));
}

module.exports.htmlHandler = htmlHandler()