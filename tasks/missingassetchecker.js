/*
 * grunt-missingassetchecker
 * https://github.com/lcalvy/grunt-missingassetchecker
 *
 * Copyright (c) 2013 Loic Calvy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('missingassetchecker', 'Check if app is missing assets ou assets is not avalaible. Could configure status codes to check (40x,50x)', function() {


    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      url: 'http://localhost:9000/',
      issues : ['network','javascript']
    });

    var Phantom = require('../lib/phantomlauncher.js');
    var phantom = new Phantom();
    phantom.launch(options, function (err, stdout, stderr) {
      console.log(stderr);
    });

  });

};
