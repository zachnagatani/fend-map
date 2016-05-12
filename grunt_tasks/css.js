module.exports = function (grunt, config) {

	grunt.config.merge({

		csslint: {

			strict: {

				src: [config.cssSrcDir + 'style.css']

			},

			lax: {

				options: {

					csslintrc: '.csslintrc'

				},

				src: [config.cssSrcDir + 'style.css']

			}

		},

		cssmin: {

			css: {

				files: {

					'dist/css/style.min.css': ['src/css/style.css'],

					'dist/css/font-awesome.min.css': ['src/css/font-awesome.min.css']

				}

			}

		},

	});

};