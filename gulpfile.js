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
	gulp.src('./common/js/script.js')
		.pipe(preprocess({context: {firefox: true,fchrome: true}}))
		.pipe(gulp.dest('./ff/data/js/'));
	gulp.src('./common/js/script.js')
		.pipe(preprocess({context: {chrome: true,fchrome: true}}))
		.pipe(gulp.dest('./chrome/js/'));
	gulp.src('./common/js/script.js')
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
gulp.task('replace',['version','copy'], function() {
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
	exec('./sdk/cfx.sh ./sdk/addon-sdk-1.16 ../../ff xpi --force-mobile', function(err){
		gulp.src('./ff/ljphoto.xpi')
			.pipe(gulp.dest('./dist'));
		done(err);
	});
});
gulp.task('chrome',['replace','lint'], function() {
	gulp.src(['manifest.json','js/*.js','icons/*.png','css/*/*','css/*','popup.html'],{cwd:'/mnt/p/src/my/browser/ljphoto/chrome'})
		.pipe(zip('ljphoto.zip'))
		.pipe(gulp.dest('dist'));
});
gulp.task('safari',['replace','lint'], function() {
	gulp.src(['./safari/Info.plist', './safari/Settings.plist', './safari/script.js'])
		.pipe(gulp.dest('./dist/ljphoto.safariextension'));
});
gulp.task('copy',function() {
	gulp.src('./common/popup.html')
		.pipe(gulp.dest('./chrome'))
		.pipe(gulp.dest('./ff/data'));
	gulp.src('./bower_components/colorbox/jquery.colorbox-min.js')
		.pipe(gulp.dest('./chrome/js'))
		.pipe(gulp.dest('./ff/data/js'));
	gulp.src('./bower_components/jquery/dist/jquery.min.js')
		.pipe(gulp.dest('./chrome/js'))
		.pipe(gulp.dest('./ff/data/js'));
	gulp.src('./bower_components/jquery-popover/jquery.popover-*.js')
		.pipe(gulp.dest('./chrome/js'))
		.pipe(gulp.dest('./ff/data/js'));
	gulp.src('./bower_components/colorbox/example1/colorbox.css')
		.pipe(gulp.dest('./ff/data/css'))
		.pipe(replace('url(','url(chrome-extension://__MSG_@@extension_id__/css/'))
		.pipe(gulp.dest('./chrome/css'));
	gulp.src('./bower_components/jquery-popover/popover.css')
		.pipe(gulp.dest('./ff/data/css'))
		.pipe(replace('url(','url(chrome-extension://__MSG_@@extension_id__/css/'))
		.pipe(gulp.dest('./chrome/css'));
	gulp.src('./bower_components/jquery-popover/popover/popover_gradient.png')
		.pipe(gulp.dest('./chrome/css'))
		.pipe(gulp.dest('./ff/data/css'));
	gulp.src('./bower_components/colorbox/example1/images/*')
		.pipe(gulp.dest('./chrome/css/images/'))
		.pipe(gulp.dest('./ff/data/css/images/'));
	gulp.src('./common/css/my.css')
		.pipe(gulp.dest('./chrome/css'))
		.pipe(gulp.dest('./ff/data/css'));

});
gulp.task('default', ['version','preprocess','lint','replace','firefox','chrome','safari','copy']);
