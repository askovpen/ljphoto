var gulp = require('gulp');
var chalk = require('chalk');
var jshint = require('gulp-jshint');
var cache = require('gulp-cache');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var preprocess = require('gulp-preprocess');
var zip = require('gulp-zip');
var paths= {
    js:[
	'./safari/script.js',
	'./chrome/scripts/script.js',
	'./chrome/scripts/bg.js',
	'./chrome/scripts/popup.js',
	'./chrome/manifest.json',
	'./ff/data/js/script.js',
	'./ff/package.json',
	'./ff/lib/main.js',
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
gulp.task('lint',['preprocess','replace'], function() {
    return gulp.src(paths.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('end', function(){
				console.log('['+chalk.green('jshint')+'] '+chalk.green.bold('✔ No problems'));
		});
});
gulp.task('replace',['version'], function() {
	gulp.src('./ff/package.json.tpl',{base: './ff/'})
		.pipe(replace('@@ver', vers))
		.pipe(rename('package.json'))
		.pipe(gulp.dest('./ff'));
	gulp.src('./chrome/manifest.json.tpl',{base: './chrome/'})
		.pipe(replace('@@ver', vers))
		.pipe(rename('manifest.json'))
		.pipe(gulp.dest('./chrome'));
	gulp.src('./safari/Info.plist.tpl',{base: './safari/'})
		.pipe(replace('@@ver', vers))
		.pipe(rename('Info.plist'))
		.pipe(gulp.dest('./safari'));
});
gulp.task('firefox',['replace','lint'], function(done) {
	exec('./sdk/cfx.sh ./sdk/addon-sdk-1.16 ../../ff xpi', function(err){
		gulp.src('./ff/ljphoto.xpi')
			.pipe(gulp.dest('./dist'));
		done(err);
	});
});
gulp.task('chrome',['replace','lint'], function() {
	gulp.src(['manifest.json','scripts/*.js','icons/*.png','css/*/*','css/*'],{cwd:'/mnt/p/src/my/browser/ljphoto/chrome'})
		.pipe(zip('ljphoto.zip'))
		.pipe(gulp.dest('dist'));
});
gulp.task('safari',['replace','lint'], function() {
	gulp.src(['./safari/Info.plist', './safari/Settings.plist', './safari/script.js'])
		.pipe(gulp.dest('./dist/ljphoto.safariextension'));
});

gulp.task('default', ['version','preprocess','lint','replace','firefox','chrome','safari']);
