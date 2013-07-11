/*
 * gitpushall
 * https://github.com/moonpyk/gitpushall
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var spawn = require('child_process'),
        fs = require("fs"),
        path = require('path'),
    //
        _ = require('lodash'),
        async = require('async'),
        ini = require("ini"),
        colors = require("colors");

    var remotesReg = new RegExp("remote [\"'](.+)[\"']");

    var git_exe = "git";

    if (process.platform == "win32") {
        git_exe = "git.exe";
    }

    var configCache = {};

    /**
     * @param {String} basePath
     * @param {String} dirName
     * @returns {String|null}
     */
    exports.lookupFor = function (basePath, dirName) {
        var curp = basePath,
            lastp = null;

        while (true) {
            if (fs.existsSync(path.join(curp, dirName))) {
                return curp;
            }

            curp = path.resolve(path.join(curp, ".."));

            if (curp === lastp) {
                return null;
            }

            lastp = curp;
        }
    };

    /**
     * @param {String} basePath
     * @returns {String|null}
     */
    exports.lookupForGit = function (basePath) {
        return exports.lookupFor(basePath, ".git");
    };

    /**
     * @param {String} basePath
     * @param {Function} callback
     */
    exports.parseGitConfig = function (basePath, callback) {
        var gitConfig = path.join(basePath, ".git", "config"),
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
                stdio[1] = stdio[2] = 'ignore';
            }

            if (_.isArray(opts.args)) {
                gitArgs = opts.args;
            }
        }

        var silent = false;

        if (_.isBoolean(opts.pushallSilent)) {
            silent = opts.pushallSilent;
        }

        if (_.isBoolean(opts.enableColors) && !opts.enableColors) {
            colors.mode = "none";
        }

        var tasks = [];

        _(remotes).each(function (v) {
            tasks.push(function (asyncC) {
                if (!silent) {
                    console.log("Remote : '%s'...", v.green.bold);
                }

                spawn.spawn(git_exe, _.union(['push', v], gitArgs), {
                    cwd: basepath,
                    env: process.env,
                    stdio: stdio
                }).on('exit', function (code) {
                        asyncC(code !== 0 ? {} : null, code);
                    });
            });
        });

        async.series(tasks, function (err, code) {
            callback(err, code);
        });
    };

}(exports));
