/*
 * gitpushall
 * https://github.com/moonpyk/gitpushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
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
            .option('-N, --no-color', "Disable output coloring")
            .option('-s, --silent', "Make git silent")
            .option('-S, --pushall-silent', "Make git-pushall silent")
            .option('-X, --shutup', "Alias for -sS")
            .parse(argv);

        var basePath = process.cwd();

        if (program.shutup) {
            program.pushallSilent = program.silent = true;
        }

        if (!fs.existsSync(path.join(basePath, ".git"))) {
            var found = git.lookupForGit(basePath);

            if (found === null) {
                if (!program.pushallSilent) {
                    console.error("Unable to find any .git repository from : '%s'", basePath);
                }

                process.exit(-1);
                return;

            } else {
                if (!program.pushallSilent) {
                    console.log("Using .git repository at : '%s'", path.join(found, ".git"));
                }
                basePath = found;
            }
        }

        git.getRemotes(basePath, function (err, remotes) {
            if (err) {
                process.exit(-1);
                return;
            }

            git.gitPushAll(basePath, remotes, {
                silent: program.silent,
                pushallSilent: program.pushallSilent,
                enableColors: program.color,
                args: program.args
            }, function (err) {
                if (err) {
                    process.exit(-1);
                }
            });
        });
    };

}(exports));
