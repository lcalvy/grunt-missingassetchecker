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

  grunt.registerMultiTask('missingassetchecker', 'Check if app is missing assets ou assets is not avalaible.', function() {
    var done = this.async();
    grunt.log.subhead('Starting missingassetchecker');
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      url: 'http://localhost:9999/',
      issues : ['networkerror','javascripterror','console']
    });

    var phantomlauncher = require('../lib/phantomlauncher.js').init(grunt);
    var stdparser = require('../lib/stdparser.js').init(grunt);

    phantomlauncher.launch(options,function(err, stdout, stderr){
      var isOK = true;

      if(err){
        grunt.fail.fatal("Unable to contact phantomjs");
        grunt.verbose.error(err);   
        done(false);
        return;   
      }
      grunt.verbose.writeln("*********",stdout,"to contact",options.url );
      if(stdout === "fail"){
        grunt.fail.fatal("Failed to contact url", options.url);
        done(false);
        return;   
      }

        for (var i = (options.issues).length - 1; i >= 0; i--) {

          var type = options.issues[i];
          if(stdparser.containstype(stderr,type)){
              grunt.verbose.error("Task failed du to error of type",type);
              grunt.verbose.error(JSON.stringify(stdparser.gettype(stderr,type)));
              grunt.fail.warn("An issue of type " + type + " was found for " + options.url);
              isOK = false;
              
          }
        }

        done(isOK);
    });


    
    

  });

};
