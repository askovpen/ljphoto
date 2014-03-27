module.exports = function( grunt ) {
    "use strict";
    var jsFiles=[
		'./ff/data/js/script.js',
		'./chrome/scripts/script.js',
		'Gruntfile.js',
		'./node_modules/grunt-contrib-readv/tasks/readv.js'
    ];
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-copy" );
    grunt.loadNpmTasks( "grunt-preprocess" );
    grunt.loadNpmTasks( "grunt-contrib-readv" );
    grunt.loadNpmTasks( "grunt-replace" );
    grunt.loadNpmTasks( "grunt-mozilla-addon-sdk" );
    grunt.loadNpmTasks( "grunt-contrib-compress" );
grunt.initConfig({
	preprocess: {
		firefox: {
			options: {
				context: {
					firefox: true
				}
			},
			src: 'script.js',
			dest: './ff/data/js/script.js'
		},
		safari: {
			options: {
				context: {
					safari: true
				}
			},
			src: 'script.js',
			dest: './safari/script.js'
		},
		chrome: {
			options: { 
				context: {
					chrome: true
				}
			},
			src: 'script.js',
			dest: './chrome/scripts/script.js'
		}
	},
	jshint: {
		options: {smarttabs:true },
		files: [jsFiles[0],'Gruntfile.js','./node_modules/grunt-contrib-readv/tasks/readv.js']
    },
    readv: { files: ['script.js'] },
    replace: {
		dist: {
			options: {
				patterns: [{
					json: {"ver":"<%= grunt.option(\"vers\") %>"}
				}]
		},
			files: [
				{src:['./chrome/manifest.json.tpl'],dest:'./chrome/manifest.json'},
				{src:['./ff/package.json.tpl'],dest:'./ff/package.json'},
				{src:['./safari/Info.plist.tpl'],dest:'./safari/Info.plist'}
			]
		}
    },
    "mozilla-addon-sdk": {
		'1_15': {
			options: {
				revision: "1.15",
			}
		}
    },
    "mozilla-cfx-xpi": {
		ljphoto: {
			options: {
				extension_dir: './ff',
				dist_dir: './dist',
				"mozilla-addon-sdk":"1_15"
			}
		}
    },
    copy: {
		safari: {
			files: [
				{expand: true, flatten: true, src:['./safari/Info.plist', './safari/Settings.plist', './safari/script.js'], dest: './dist/ljphoto.safariextension/'}
			]
		}
    },
    compress: {
		ljphoto: {
			options: {
				archive: "dist/ljphoto.zip"
			},
			'expand':true,
			'cwd':'chrome/',
			'src': ['manifest.json','scripts/script.js','icons/*.png'],
			'dest': ''
		}
    }	
});
grunt.registerTask( "default", [ "readv", "preprocess", "jshint","replace","mozilla-cfx-xpi",'compress','copy' ] );
};
