module.exports = function(grunt, config) {
	grunt.config.merge({

		jshint: {

			all: [

				'Gruntfile.js',

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

					'dist/js/app.js': ['src/js/app.js'],

					'dist/js/initMap.js': ['src/js/initMap.js'],

					'dist/js/model.js': ['src/js/model.js'],

					'dist/knockout/knockout.js': ['src/knockout/knockout.js'],

					'dist/jquery/jquery.min.js': ['src/jquery/jquery.min.js']

				}

			}

		},

	});
};