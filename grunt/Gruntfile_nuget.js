﻿module.exports = function (grunt) {
  //Custom nuget
  require('./tip-install/tasks/tip-cli')(grunt);

  grunt.initConfig({
      'tip-install': {}
    }
  );

  grunt.registerTask('default', ['tip-install']);
};
