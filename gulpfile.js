//noinspection JSUnusedGlobalSymbols
var gulp = require('gulp'),
    tsc = require('typescript'),
    ts = require('gulp-typescript'),
    watch = require('gulp-watch'),
    less = require('gulp-less'),
    del = require('del');

var tsProject = ts.createProject('./tsconfig.json');
var dist = 'dist';
var src = 'src';
var apiDefs = src + '/defs/api.json';
var swaggerUi = src + '/swagger-ui';
var tsFiles = src + '/**/*.ts';
var client = src + '/client';

gulp.task('default', ['compile'], function () {
});

gulp.task('clean', function () {
    return del([dist + '/**', '!' + dist]);
});

gulp.task('compile', ['swagger-content', 'api-docs', 'client-content'], function () {
    return gulp.src(tsFiles)
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest(dist));
});

gulp.task('watch', ['compile'], function () {
    gulp.watch([tsFiles, apiDefs, swaggerUi + '/**', client + '/**/*.{css,html,less,js}'], ['compile']);
});

gulp.task('swagger-content', function () {
    return gulp.src(["./node_modules/swagger-ui/dist/**", swaggerUi + "/**"])
        .pipe(gulp.dest(dist + '/swagger'))
});

gulp.task('less', function () {
    gulp.src(client + '/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(dist + '/client'));
});

gulp.task('client-content', ['less'], function () {
    return gulp.src([client + '/**/*.{css,html,js}',
        'node_modules/eonasdan-bootstrap-datetimepicker/node_modules/jquery/dist/jquery.min.js',
        'node_modules/eonasdan-bootstrap-datetimepicker/node_modules/moment/min/moment-with-locales.js',
        'node_modules/eonasdan-bootstrap-datetimepicker/node_modules/bootstrap/dist/**',
        'node_modules/eonasdan-bootstrap-datetimepicker/build/**',
        'node_modules/react/dist/react-with-addons.js',
        'node_modules/react-dom/dist/react-dom.js',
        'node_modules/babel-core/browser.js'
    ]
    )
        .pipe(gulp.dest(dist + '/client'))
});

gulp.task('api-docs', function () {
    return gulp.src(apiDefs)
        .pipe(gulp.dest(dist))
});