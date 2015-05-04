var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var liveReload = require('gulp-livereload');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');


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

gulp.task('less', function () {
	return gulp.src('src/less/main.less')
		//.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(plumber())
		.pipe(less({
			paths: ['./node_modules']
		}))
		//.pipe(sourcemaps.write())
		.pipe(autoprefixer())
		.pipe(gulp.dest('public/assets'))
		.pipe(liveReload());
});

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