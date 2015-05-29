/*
 * grunt-missingassetchecker
 * https://github.com/lcalvy/grunt-missingassetchecker
 *
 * Copyright (c) 2013 Loic Calvy
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'lib/*.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        missingassetchecker: {
            options: {
                issues: ["javascripterror", "networkerror"]
            },
            //test: {
            //    "options": {
            //        url: 'http://www.google.com',
            //        "report": 'tmp/test',
            //        "screenshots": 'tmp/test/screenshots/',
            //    },
            //},
            home: {
                options: {
                    url: 'http://localhost:9000/',

                },
            },
            javascripterror: {
                options: {
                    url: 'http://localhost:9000/javascripterror.html',
                    issues: ["javascripterror"]

                },
            },
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

        express: {
            options: {
                port: 9999,
                background: true
            },
            test: {
                options: {
                    script: 'test/server.js'
                }
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-express-server');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'express:test', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
