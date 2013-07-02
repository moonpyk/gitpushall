/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var pack = require('../package.json'),
        program = require('commander');

    /**
     * @param {Array} argv
     */
    exports.main = function (argv) {
        program
            .version(pack.version)
            .usage('[options]')
            .option('-s, --silent', "Make git quit silent, except for errors")
            .option('-S, --really-silent', "Make git ultra silent, even for errors")
            .parse(argv);

    };

}(exports));
