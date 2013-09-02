'use strict';

var grunt = require('grunt');

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

    var Phantom = require('../lib/phantomlauncher.js');
    var phantom = new Phantom();
    phantom.launch(
    {
      url: 'http://dummyurl:9000/'
    },
    function (err, stdout, stderr) {
        test.ok(err == null && stdout != null , 'phantom communication is ok');
        test.done();
    });
  },
  test_allnetworksressourceok: function(test) {
    test.expect(1);

    var Phantom = require('../lib/phantomlauncher.js');
    var phantom = new Phantom();
    phantom.launch(
    {
      url: 'http://localhost:9000/'
    },
    function (err, stdout, stderr) {
        console.log('******',err,'*****');
        console.log('******',stdout,'*****');
        console.log('******',stderr,'*****');
        test.ok(err === null && stderr === '', 'all network ressources are available');
        test.done();
    });
  }
};
