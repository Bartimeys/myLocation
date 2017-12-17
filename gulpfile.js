var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    minifyCSS = require('gulp-csso'),
    sass = require('gulp-sass'),autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var paths = {
    scripts: ['src/js/**/*.js', 'src/js/**/*.js'],
    images: 'src/img/*',
    css : ['src/css/*.scss', 'node_modules/materialize-css/dist/css/materialize.min.css'],
    fonts : ['node_modules/materialize-css/dist/fonts/**/**']
};



// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({
            stream: true
        }))

});

//concat, buils, autoprefix scss
gulp.task('css', function(){
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(minifyCSS())
        .pipe(concat('all.style.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
//copy fonts
gulp.task('font', function() {
    return gulp.src(paths.fonts)
    // Pass in options to the task
        .pipe(gulp.dest('build/fonts/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy all static images
gulp.task('images', function() {
    return gulp.src(paths.images)
    // Pass in options to the task
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.reload({
            stream: true
        }))
});
// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts'], browserSync.reload);
    gulp.watch(paths.images, ['images'], browserSync.reload);
    gulp.watch('css/*.scss', ['css'], browserSync.reload);
    gulp.watch(paths.fonts, ['font']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('build/**/*.js', browserSync.reload);
    gulp.watch('build/**/*.css', browserSync.reload);
});

// The default task (called when you run `gulp` from cli)

gulp.task('default', ['browserSync','watch', 'css', 'scripts', 'images'], function() {
    gulp.watch('css/*.scss', ['css'], browserSync.reload);
    gulp.watch(paths.scripts, ['scripts'], browserSync.reload);
    gulp.watch(paths.images, ['images'], browserSync.reload);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('scripts', browserSync.reload);
    gulp.watch('css', browserSync.reload);
});