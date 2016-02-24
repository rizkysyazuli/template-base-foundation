var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync');

var prod = gutil.env.prod;

gulp.task('html', function() {
    return gulp.src('template/**/*.html')
        // .pipe(prod ? processhtml() : gutil.noop())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

gulp.task('bower', function() {
    return gulp.src(['template/index.html'])
        .pipe(wiredep())
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [].concat([
                'bower_components/foundation-sites/scss'
            ])
        }))
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 9'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function() {
    browserSync.init({
        proxy: 'http://localhost/~rzky/templates/base-foundation/build/',
        watchTask: true,
        port: 8000
    });

    gulp.watch('bower.json', ['bower']);
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('template/**/*.html', ['html']);
});

// use gulp-sequence to finish building html, sass and js before first page load
gulp.task('default', gulpSequence(['html', 'bower', 'sass'], 'serve'));
