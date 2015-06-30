'use strict';

var grunt = require('grunt');
var phantomlauncher = require('../lib/phantomlauncher.js').init(grunt);
var stdparser = require('../lib/stdparser.js').init(grunt);
/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */


function bakeOptions(urls, screenshots) {
    return {
        urls: urls,
        resourceFilter: function () {
            return true;
        },
        screenshots: screenshots,
        phantom: {
            maxOpenPages: 1,
            cliOptions: {
                'load-images': 'true'
            },
            settings: {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
                viewportSize: {width: 1280, height: 1024}
            }
        }
    };
}

exports.missingassetchecker = {
    test_phantomcommunication: function (test) {
        test.expect(1);

        var options = bakeOptions(['http://dummyurl:9000/']);
        phantomlauncher.launch(options,
            options.urls[0],
            function (stdout, stderr, abortedRequests) {
                test.ok(stdout === 'fail', 'phantom communication is ok');
                test.done();
            });
    },
    test_allnetworksressourceok: function (test) {
        test.expect(2);

        var options = bakeOptions(['http://localhost:9999/noproblem.html']);
        phantomlauncher.launch(options,
            options.urls[0],
            function (stdout, stderr, abortedRequests) {
                test.ok(stdout === 'success', 'url connected');
                test.ok(stderr.length === 0, 'all network resources are available');
                test.done();
            });
    },
    test_missingnetworksressource: function (test) {
        test.expect(1);

        var options = bakeOptions(['http://localhost:9999/missingasset.html']);
        phantomlauncher.launch(options,
            options.urls[0],
            function (stdout, stderr, abortedRequests) {
                //console.log(stderr);
                test.ok(stdparser.containserrcode(stderr, 203), 'one missing network resource');
                test.done();
            });
    },
    test_screenshot: function (test) {
        test.expect(2);

        var options = bakeOptions(['http://localhost:9999/noproblem.html'], 'tmp/screenshots');
        phantomlauncher.launch(options,
            options.urls[0],
            function (stdout, stderr, abortedRequests) {
                test.ok(!stderr.length);
                // letting phantomjs finish write to disk
                setTimeout(function(){
                    test.ok(grunt.file.exists('tmp/screenshots/http___localhost_9999_noproblem_html.png'));
                    test.done();
                }, 100);
            });
    }

    // TODO: uncomment when phantomJs stops crashing
    // @see https://github.com/sgentle/phantomjs-node/issues/287
    //test_javascripterror: function (test) {
    //    test.expect(1);
    //
    //    phantomlauncher.launch(options,
    //        'http://localhost:9999/javascripterror.html',
    //        function (stdout, stderr, abortedRequests) {
    //            test.ok(stdparser.containstype(stderr, "javascripterror"), 'one javascript error');
    //            test.done();
    //        });
    //},
    //test_console: function (test) {
    //    test.expect(1);
    //
    //    phantomlauncher.launch(options,
    //        'http://localhost:9999/console.html',
    //        function (stdout, stderr, abortedRequests) {
    //            test.ok(stdparser.containstype(stderr, "console"), 'one console message found');
    //            test.done();
    //        });
    //}
};
