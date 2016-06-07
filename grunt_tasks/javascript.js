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

					'dist/js/preload.js': ['src/js/preload.js'],

					'dist/js/error.js': ['src/js/error.js'],

					'dist/js/init.js': ['src/js/init.js'],

					'dist/knockout/knockout.js': ['src/knockout/knockout.js'],

					'dist/jquery/jquery.min.js': ['src/jquery/jquery.min.js']

				}

			}

		}

		// concat: {
		//     options: {
		//       separator: ';',
		//     },
		//     dist: {
		//       src: ['src/js/model.js', 'src/js/preload.js', 'src/js/error.js', 'src/js/init.js', 'src/js/main.js'],
		//       dest: 'dist/js/app.js',
		//     },
		// },

	});
};