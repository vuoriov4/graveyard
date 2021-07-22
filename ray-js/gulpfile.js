const gulp = require('gulp');
const uglify = require('gulp-uglify')
const streamify = require('gulp-streamify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('js', function(){
    return browserify({entries: ['src/RAY.js'], standalone: 'RAY', debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('ray.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', [ 'js' ]);
