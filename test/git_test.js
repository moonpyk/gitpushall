/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var git = require('../lib/git.js');

    exports.setUp = function (done) {
        done();
    };

    exports.noop = function (test) {
        test.ok(true);
        test.done();
    };
}(exports));