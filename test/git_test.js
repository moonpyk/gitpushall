/*
 * gitpushall
 * https://github.com/moonpyk/gitpushall
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

    exports.lookupForWontRecurseInfinitely = function (test) {
        // Almost no chance to find a directory named like that
        var rndPath = ".test_" + Math.round((Math.random() + 1) * 1000000);

        test.equal(git.lookupFor(process.cwd(), rndPath), null);
        test.done();
    };

    exports.lookupForWillFindAGitRepo = function (test) {
        var found = git.lookupFor(process.cwd(), ".git");

        console.log();
        console.log("Found : %s", found);

        test.notEqual(found, null);
        test.done();
    };

    exports.lookupForGitWorks = function (test) {
        var cwd = process.cwd();
        test.equal(git.lookupForGit(cwd), git.lookupFor(cwd, ".git"));
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
