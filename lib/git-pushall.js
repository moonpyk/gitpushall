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
        cmd = require('./git.js');

    /**
     * @param {Array} argv
     */
    exports.main = function (argv) {
        program
            .version(pack.version)
            .usage('[options] [-- git-push-options...]')
            .option('-s, --silent', "Make git quit silent, except for errors")
            .option('-S, --really-silent', "Make git ultra silent, even for errors")
            .parse(argv);

        var basePath = process.cwd();

        cmd.getRemotes(basePath, function (err, remotes) {
            if (err) {
                process.exit(-1);
                return;
            }

            cmd.gitPushAll(basePath, remotes, {
                silent: program.silent,
                reallySilent: program.reallySilent,
                args: program.args
            }, function (err) {
                if (err) {
                    process.exit(-1);
                }
            });
        });
    };

}(exports));
