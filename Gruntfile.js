module.exports = function( grunt ) {
    "use strict";
    var jsFiles=[
	'./script.js',
    ];
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-readv" );
    grunt.loadNpmTasks( "grunt-replace" );
    grunt.loadNpmTasks( "grunt-mozilla-addon-sdk" );
    grunt.loadNpmTasks( "grunt-contrib-compress" );
    

grunt.initConfig({
    jshint: {
	options: {smarttabs:true },
	files: jsFiles
    },
    readv: { files: jsFiles },
    replace: {
	dist: {
	    options: {
		patterns: [{
		    json: {"ver":"<%= grunt.option(\"vers\") %>"}
		}]
	    },
	    files: [
		{src:['./chrome/manifest.json.tpl'],dest:'./chrome/manifest.json'},
		{src:['./ff/package.json.tpl'],dest:'./ff/package.json'}
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
grunt.registerTask( "default", [ "readv", "jshint","replace","mozilla-cfx-xpi",'compress' ] );
};
