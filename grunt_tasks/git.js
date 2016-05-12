module.exports = function(grunt, config) {

	grunt.config.merge({

		'gh-pages': {

			options: {

				base: 'dist'

			},

			dist: ['**']

		},

	});

};