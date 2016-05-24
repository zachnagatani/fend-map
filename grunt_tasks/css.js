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

					'dist/css/style.css': ['src/css/style.css'],

				}

			}

		},

		imagemin: {
			jpgs: {
				options: {
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'src/images',
					src: ['*.{jpg,png,gif}'],
					dest: 'dist/images/',
				}]
			}
		}

	});

};