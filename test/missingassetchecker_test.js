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



exports.missingassetchecker = {
  test_phantomcommunication: function(test) {
    test.expect(1);
    
    phantomlauncher.launch(
    {
      url: 'http://dummyurl:9000/'
    },
    function (err, stdout, stderr) {
        test.ok(!err, 'phantom communication is ok');
        test.done();
    });
  },
  test_allnetworksressourceok: function(test) {
    test.expect(2);

    phantomlauncher.launch(
    {
      url: 'http://localhost:9999/noproblem.html'
    },
    function (err, stdout, stderr) {
        test.ok(stdout === 'success' , 'url connected');
        test.ok(stderr.length === 0 , 'all network ressources are available');
        test.done();
    });
  },
  test_missingnetworksressource: function(test) {
    test.expect(1);

    phantomlauncher.launch(
    {
      url: 'http://localhost:9999/missingasset.html'
    },
    function (err, stdout, stderr) {
        test.ok(stdparser.containshttpstatus(stderr,404), 'one missing network ressources');
        test.done();
    });
  },
  test_javascripterror: function(test) {
    test.expect(1);

    phantomlauncher.launch(
    {
      url: 'http://localhost:9999/javascripterror.html'
    },
    function (err, stdout, stderr) {
        test.ok(stdparser.containstype(stderr,"javascripterror"), 'one javascript error');
        test.done();
    });
  },
  test_console: function(test) {
    test.expect(1);

    phantomlauncher.launch(
    {
      url: 'http://localhost:9999/console.html'
    },
    function (err, stdout, stderr) {
        test.ok(stdparser.containstype(stderr,"console"), 'one console message found');
        test.done();
    });
  }
};
