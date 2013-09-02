'use strict'
var path = require('path')
var phantomjs = require('phantomjs')
var childProcess = require('child_process')


var phantomlauncher = module.exports = function () {
};


phantomlauncher.prototype.launch = function log(options,callback) {

	var childArgs = [path.join(__dirname, 'phantomissuechecker.js'),options.url];
    childProcess.execFile(phantomjs.path, childArgs, callback);
};
