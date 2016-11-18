module.exports = function(grunt) {

	grunt.registerTask("default", ["build", "nodeunit", "uglify"]);

};
