/*
 * git-pushall
 * https://github.com/moonpyk/git-pushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var spawn = require('child_process'),
        fs = require("fs"),
    //
        _ = require('lodash'),
        async = require('async'),
        ini = require("ini");

    var remotesReg = new RegExp("remote [\"'](.+)[\"']");

    var git_exe = "git";

    if (process.platform == "win32") {
        git_exe = "git.exe";
    }

    var configCache = {};

    /**
     * @param {String} basePath
     * @param {Function} callback
     */
    exports.parseGitConfig = function (basePath, callback) {
        var gitConfig = basePath + "/.git/config",
            cached = configCache[basePath];

        if (_.isObject(cached) && !_.isEmpty(cached)) {
            callback(null, cached);
        }

        fs.readFile(gitConfig, "utf8", function (err, content) {
            if (err) {
                callback(err, null);
                return;
            }

            var parsed = ini.decode(content);

            configCache[gitConfig] = parsed;

            callback(null, parsed);
        });
    };

    /**
     * @param {String} basePath
     * @param {Function} callback
     */
    exports.getRemotes = function (basePath, callback) {
        exports.parseGitConfig(basePath, function (err, parsed) {
            if (err) {
                callback(err, null);
                return;
            }

            var ret = [];

            _(parsed).each(function (v, k) {
                var remote = remotesReg.exec(k);

                if (remote !== null) {
                    ret.push(remote[1]);
                }
            });

            callback(null, ret);
        });
    };

    /**
     * @param {String} basepath
     * @param {Array} remotes
     * @param {Object} opts
     * @param {Function} [callback]
     */
    exports.gitPushAll = function (basepath, remotes, opts, callback) {
        if (!_.isFunction(callback)) {
            callback = function () {

            };
        }
        var stdio = ['ignore', process.stdout, process.stderr],
            gitArgs = [];

        if (_.isObject(opts) && !_.isEmpty(opts)) {
            if (_.isBoolean(opts.silent) && opts.silent) {
                stdio[1] = 'ignore';
            }

            if (_.isBoolean(opts.reallySilent) && opts.reallySilent) {
                stdio[2] = 'ignore';
            }

            if (_.isArray(opts.args)) {
                gitArgs = opts.args;
            }
        }

        var tasks = [];

        _(remotes).each(function (v) {
            tasks.push(function (asyncC) {
                spawn.spawn(git_exe, _.union(['push', v], gitArgs), {
                    cwd: basepath,
                    env: process.env,
                    stdio: stdio
                }).on('exit', function (code) {
                        var err = code !== 0 ? {} : null;
                        asyncC(err, code);
                    });
            });
        });

        async.series(tasks, function (err, code) {
            callback(err, code);
        });
    };

}(exports));