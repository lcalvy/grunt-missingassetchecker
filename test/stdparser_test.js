'use strict';

var grunt = require('grunt');
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



exports.stdparser = {
  test_containstype: function(test) {
    test.expect(1);

    var std = [{type:"networkerror"}];

    test.ok(stdparser.containstype(std,"networkerror"),"should contains an error of type networkerror");
    test.done();
  },
  test_notcontainstype: function(test) {
    test.expect(1);

    var std = [{type:"console"}];

    test.ok(!stdparser.containstype(std,"networkerror"),"should not contains an error of type networkerror");
    test.done();
  },
  test_containsmessage: function(test) {
    test.expect(1);

    var std = [{type:"console", message : "bip"}];

    test.ok(stdparser.containsmessage(std,"bip"),"should contains a bip message");
    test.done();
  },
  test_notcontainsmessage: function(test) {
    test.expect(1);

    var std = [{type:"console", message : "blurp"}];

    test.ok(!stdparser.containsmessage(std,"bip"),"should not contains a bip message");
    test.done();
  },
  test_containshttpstatus: function(test) {
    test.expect(1);

    var std = [{type:"networkerror", status : 404}];

    test.ok(stdparser.containshttpstatus(std,404),"should contains a 404 network error");
    test.done();
  },
  test_notcontainshttpstatus: function(test) {
    test.expect(1);

    var std = [{type:"networkerror", status : 404}];

    test.ok(!stdparser.containshttpstatus(std,500),"should not contains a 500 network error");
    test.done();
  }
};
