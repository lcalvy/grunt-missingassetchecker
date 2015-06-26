/*
 * grunt-missingassetchecker
 * https://github.com/lcalvy/grunt-missingassetchecker
 *
 * Copyright (c) 2013 Loic Calvy
 * Licensed under the MIT license.
 */

'use strict';
var Q = require('q');
var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('missingassetchecker', 'Check if app is missing assets or assets are not available.', function () {
        var done = this.async();
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            url: undefined, // @deprecated
            urls: ['https://www.google.com/'],
            issues: ['networkerror', 'javascripterror', 'console'],
            failThreshold: 0,
            resourceFilter: function (resourceUrl) {
                return true;
            },
            report: false,
            screenshots: false,
            phantom: {
                maxOpenPages: 5,
                cliOptions: {
                    'load-images': 'true',
                    'ignore-ssl-errors': 'true',
                    'local-to-remote-url-access': 'true',
                    'ssl-protocol': 'tlsv1' //fixes issue with SSLv3 (errCode 6 "the SSL/TLS handshake failed"), @see https://github.com/ariya/phantomjs/issues/12655
                },
                settings: {
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
                    viewportSize: { width: 1280, height: 1024 }
                }
            }
        });

        // backward compatibility for "url" parameter
        if (options.url) {
            options.urls = [options.url];
            //grunt.option('urls', options.urls);
        }

        var phantomlauncher = require('../lib/phantomlauncher.js').init(grunt);
        var stdparser = require('../lib/stdparser.js').init(grunt);

        if (options.report) {
            grunt.file.delete(path.join(process.cwd(), options.report));
        }
        if (options.screenshots) {
            grunt.file.delete(path.join(process.cwd(), options.screenshots));
        }

        var promises = [];
        var rollUpReportData = {
            issues: [],
            abortedRequests: [],
            date: undefined,
            gruntTarget: this.target
        };

        var q = async.queue(function (task, callback) {
            grunt.log.subhead('Starting missingassetchecker to', task.pageUrl);
            phantomlauncher.launch(options, task.pageUrl, function (err, stdout, stderr, abortedRequests) {
                grunt.verbose.writeln("err :", JSON.stringify(err, null, '\t'));
                grunt.verbose.writeln("stdout :", JSON.stringify(stdout, null, '\t'));
                grunt.verbose.writeln("stderr :", JSON.stringify(stderr, null, '\t'));
                var isOK = true;
                if (err) {
                    grunt.fail.fatal("Unable to contact phantomjs");
                    grunt.verbose.error(err);
                    done(false);
                    return;
                }
                grunt.verbose.writeln("*********", stdout, "to contact", task.pageUrl);

                for (var i = (options.issues).length - 1; i >= 0; i--) {

                    var type = options.issues[i];
                    if (stdparser.containstype(stderr, type)) {
                        grunt.log.error("An issues of type " + type + " was found for " + task.pageUrl);
                        stdparser.gettype(stderr, type).forEach(function (item, i) {
                            grunt.log.error(JSON.stringify(item));
                            rollUpReportData.issues.push(item);
                        });
                        isOK = isOK && false;
                    }
                }
                rollUpReportData.abortedRequests = rollUpReportData.abortedRequests.concat(abortedRequests);
                callback();
                task.deferred.resolve(isOK);
            });
        }, options.phantom.maxOpenPages);



        options.urls.forEach(function (pageUrl) {
            var deferred = Q.defer();
            promises.push(deferred.promise);
            q.push({pageUrl: pageUrl, deferred: deferred}, function (err) {
                grunt.log.ok('Done testing', pageUrl);
            });
        });

        Q.all(promises).then(function (resolvedWith) {
            var isOk;
            grunt.log.ok('Done testing of ' +  resolvedWith.length + ' URLs');
            rollUpReportData.date = new Date();

            if (options.report) {
                grunt.verbose.writeln('Writing logs to ' + options.report);
                //grunt.file.mkdir(path.join(process.cwd(), options.report));
                grunt.file.copy(path.join(__dirname, '..', 'reports/index.html'), path.join(process.cwd(), options.report, 'index.html'));
                grunt.file.write(path.join(process.cwd(), options.report, 'report.json'), JSON.stringify(rollUpReportData));
            }
            // calculating common isOk for all promises
            //var isOk = resolvedWith.reduce(function (previousValue, currentValue) {
            //    return previousValue && currentValue
            //});
            isOk = (rollUpReportData.issues.length <= options.failThreshold);

            if (!isOk) {
                grunt.log.writeln('Total issues found:' + rollUpReportData.issues.length);
                grunt.log.writeln('Failure threshold:' + options.failThreshold);
            }
            done(isOk);
        }, function (err) {
            grunt.fail.fatal('Something went wrong: ' + err);
        });

    });
};
