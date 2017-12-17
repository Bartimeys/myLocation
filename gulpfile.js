var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var minifyCSS = require('gulp-csso');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

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

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});
//concat, buils, autoprefix scss
gulp.task('css',['clean'], function(){
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
});
//copy fonts
gulp.task('font', ['clean'], function() {
    return gulp.src(paths.fonts)
    // Pass in options to the task
        .pipe(gulp.dest('build/fonts/'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
    return gulp.src(paths.images)
    // Pass in options to the task
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch('css/*.scss', ['sass']);
    gulp.watch(paths.fonts, ['font']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images','css','font']);