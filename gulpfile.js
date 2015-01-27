var gulp = require('gulp');
var liveReload = require('gulp-livereload');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var tap = require('gulp-tap');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var server = require('./server');

gulp.task('cleanScripts', function(){
	return gulp.src(['public/assets*'], { read: false })
		.pipe(plumber())
		.pipe(clean({ force: true }));
});

gulp.task('scripts', ['cleanScripts'], function(cb){

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

//gulp.task('cleanTemplates', function(){
//	return gulp.src(['public/*', '!public/assets'], { read: false })
//		.pipe(plumber())
//		.pipe(clean({ force: true }));
//});

gulp.task('templates', function(){
	liveReload.changed('*.html');
});

gulp.task('watch', function(){
	liveReload.listen();

	gulp.watch('src/**/*.{js,less}', ['scripts']);
	gulp.watch('public/**/*.{ejs,html,json,img}', ['templates']);
});

gulp.task('default', ['scripts', 'templates'], function(){
	return gulp.start('watch');
});