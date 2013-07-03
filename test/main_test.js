/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    'use strict';

    var main = require('../lib/main.js');

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

    exports.mainTest = {
        setUp: function (done) {
            // setup here
            done();
        },
        noop: function (test) {
            test.ok(true);
            test.done();
        }
    };
}(exports));
