var gulp = require('gulp');
var gutil = require('gulp-util');
var es = require('event-stream');
var chalk = require('chalk');
var changed = require('gulp-changed');
var jshint = require('gulp-jshint');
var buster = require('gulp-buster');
var cache = require('gulp-cache');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var preprocess = require('gulp-preprocess');
var paths= {
    js:[
	'./ff/data/js/script.js',
	'./chrome/scripts/script.js',
	'gulpfile.js'
    ]
};
var vers='';

gulp.task('version', function(done){
	exec('/usr/bin/git rev-list HEAD --count', function(err, stdout, stderr){
		vers='1.1.'+stdout.replace(/(\r\n|\n|\r)/gm,"");
		console.log('['+chalk.green('version')+'] '+chalk.green.bold(vers));
		done();
	});
});
gulp.task('preprocess', function() {
	gulp.src('./script.js')
		.pipe(preprocess({context: {firefox: true}}))
		.pipe(gulp.dest('./ff/data/js/'));
	gulp.src('./script.js')
		.pipe(preprocess({context: {chrome: true}}))
		.pipe(gulp.dest('./chrome/scripts/'));
	gulp.src('./script.js')
		.pipe(preprocess({context: {safari: true}}))
		.pipe(gulp.dest('./safari/'));
});
gulp.task('lint', function() {
    return gulp.src(paths.js)
		.pipe(cache(jshint(),{
			success: function (jshintedFile) { return jshintedFile.jshint.success; },
			value: function (jshintedFile) {return { jshint: jshintedFile.jshint }; }
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('end', function(){
				console.log('['+chalk.green('jshint')+'] '+chalk.green.bold('✔ No problems'));
		});
});
gulp.task('templ',['version'], function() {
	return gulp.src('./ff/package.json.tpl',{base: './ff/'})
		.pipe(replace('@@ver', vers))
		.pipe(rename('package.json'))
		.pipe(gulp.dest('./ff'));
});

gulp.task('default', ['version','preprocess','lint','templ']);