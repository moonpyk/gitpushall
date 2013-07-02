/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var git = require('../lib/git.js'),
        _ = require('lodash');

    exports.setUp = function (done) {
        exports.valid_directory = process.cwd();
        exports.invalid_directory = "/non/existant/path";
        done();
    };

    exports.noop = function (test) {
        test.ok(true);
        test.done();
    };

    exports.parseValidGitConfig = function (test) {
        git.parseGitConfig(exports.valid_directory, function (err, parsed) {
            test.ok(err === null);
            test.ok(_.isObject(parsed));
            test.done();
        });
    };

    exports.parseInvalidGitConfig = function (test) {
        git.parseGitConfig(exports.invalid_directory, function (err, parsed) {
            test.ok(err !== null);
            test.ok(parsed === null);
            test.done();
        });
    };

    exports.getValidRemotes = function (test) {
        git.getRemotes(exports.valid_directory, function (err, remotes) {
            test.ok(err === null);
            test.ok(_.isArray(remotes));
            test.ok(_.contains(remotes, 'origin'));
            test.done();
        });
    };

    exports.getInvalidRemotes = function (test) {
        git.getRemotes(exports.invalid_directory, function (err, remotes) {
            test.ok(err !== null);
            test.ok(remotes === null);
            test.done();
        });
    };
}(exports));