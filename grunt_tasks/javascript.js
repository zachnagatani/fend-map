module.exports = function(grunt, config) {
	grunt.config.merge({

		comments: {
		    js: {
		      options: {
		        singleline: true,
		        multiline: false
		      },
		      src: [ 'src/**/*.js' ]
		    },
		    css: {
		      options: {
		        singleline: true,
		        multiline: true
		      },
		      src: [ 'src/css/*.css' ]
		    }
		 },

		// concat: {
		// 	dist: {
		// 		src: [config.jsSrcDir + 'model.js', config.jsSrcDir + 'main.js',]
		// 		dest: config.jsDiDir + 'scripts.js'
		// 	},
		// },

		jshint: {

			all: [

				'gruntfile.js',

				'grunt_tasks/*.js',

				config.jsSrcDir + "*.js"

			]

		},

		uglify: {

			options: {

				mangle: false

			},

			my_target: {

				files: {

					'dist/js/main.js': ['src/js/main.js'],

					'dist/js/model.js': ['src/js/model.js'],

					'dist/knockout/knockout.js': ['src/knockout/knockout.js'],

					'dist/jquery/jquery.min.js': ['src/jquery/jquery.min.js']

				}

			}

		},

	});
};