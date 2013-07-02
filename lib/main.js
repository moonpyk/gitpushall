/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var util = require('util'),
    //
        program = require('commander'),
    //
        pack = require('../package.json'),
        git = require('./git.js');

    /**
     * @param {Array} argv
     */
    exports.main = function (argv) {
        program
            .version(pack.version)
            .usage('[options] [-- git-push-options...]')
            .option('-s, --silent', "Make git silent")
            //.option('-S, --pushall-silent', "Make git-pushall silent")
            .parse(argv);

        var basePath = process.cwd();

        git.getRemotes(basePath, function (err, remotes) {
            if (err) {
                process.exit(-1);
                return;
            }

            git.gitPushAll(basePath, remotes, {
                silent: program.silent,
                args: program.args
            }, function (err) {
                if (err) {
                    process.exit(-1);
                }
            });
        });
    };

}(exports));
