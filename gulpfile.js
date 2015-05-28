var gulp = require('gulp');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var less = require('gulp-less');
var importCss = require('gulp-import-css');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var liveReload = require('gulp-livereload');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var pixrem = require('gulp-pixrem');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var lessOptions = {
	paths: ['./node_modules']
};

gulp.task('scripts_clean', function(){
	return gulp.src(['public/assets/*bundle*'], { read: false })
		.pipe(plumber())
		.pipe(clean({ force: true }));
});

gulp.task('scripts', ['scripts_clean'], function(cb){

	webpack(webpackConfig, function(err, stats) {
		if(err){
			console.log('error', err);
			return;
		}

		console.log(stats.toString({
			timings: true,
			colors: true,
			chunks: false,
			children: false
		}));

		for(var key in stats.compilation.assets){
			if (!stats.compilation.assets.hasOwnProperty(key))
				continue;

			if(key.indexOf('.css') === -1){
				continue;
			}

			liveReload.changed(key);
		}

		cb();
	});
});

gulp.task('scripts_build', ['scripts_clean'], function(cb){
	webpack.debug = false;
	webpack.devtool = 'source-map';
	webpackConfig.output.filename = '[name].bundle.min.js';

	webpack(webpackConfig, function(){
		cb();
	});
});

gulp.task('less_clean', function(){
	return gulp.src(['public/assets/main*.css', '!public/assets/*bundle*'], { read: false })
		.pipe(plumber())
		.pipe(clean({ force: true }));
});

gulp.task('less', ['less_clean'], function () {
	return gulp.src('src/less/main.less')
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(plumber(function (error) {
			gutil.log(error.message);
			this.emit('end');
		}))
		.pipe(less(lessOptions))
		.pipe(sourcemaps.write({ includeContent: false }))
		.pipe(autoprefixer("> 1%"))
		.pipe(pixrem({ replace: false, atrules: true }))
		.pipe(gulp.dest('public/assets'))
		.pipe(liveReload());
});

gulp.task('less_build', ['less_clean'], function () {
	return gulp.src('src/less/main.less')
		.pipe(less(lessOptions))
		.pipe(importCss())
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(autoprefixer("> 1%"))
		.pipe(pixrem({ replace: false, atrules: true }))
		.pipe(gulp.dest('public/assets'));
});

gulp.task('templates', function(){
	liveReload.changed('*.html');
});

gulp.task('build', ['scripts_build', 'less_build']);

gulp.task('watch', function(){
	liveReload.listen();

	gulp.watch('src/scripts/**/*.{js,less}', ['scripts']);
	gulp.watch('src/less/**/*.{less,css	}', ['less']);
	gulp.watch('public/**/*.{ejs,html,json,img}', ['templates']);
});

gulp.task('default', ['less', 'scripts', 'templates'], function(){
	var server = require('./server');

	return gulp.start('watch');
});