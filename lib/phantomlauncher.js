'use strict';
//var path = require('path')
//var phantomjs = require('phantomjs')
//var childProcess = require('child_process')

var phantom=require('node-phantom');

exports.init = function (grunt) {


	var exports = {};
	exports.launch = function(options,callback) {

		var stderr = [];

		phantom.create(function(err,ph) {
			if(err){
				callback(err,null,stderr);
				return;
			}
			return ph.createPage(function(err,page) {
					if(err){
						callback(err,null,stderr);
						return;
					}
					page.onConsoleMessage = function (msg) {
						//console.warn("console.log in source code :", msg);
						stderr.push({type:"console",message : msg});
		};

		page.onError =  function(msg, trace) {
			var msgStack = [];
			if (trace && trace.length) {
				trace.forEach(function(t) {
					msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
				});
			}
			//console.error(msgStack.join('\n'));
			stderr.push({type:"javascripterror",message : msg, trace : msgStack });
		};

		page.onResourceReceived = function (response) {
			
			if(response.status >=400 && response.status <600 && response.stage === "start"){
				//console.error("NETWORK ERROR: Receive failed", response.status, "on request url",response.url);
				stderr.push({type:"networkerror",message : "Receive failed " + response.status + " on request url " + response.url, url : response.url, status : response.status});
			}

		};

		page.onLoadFinished =  function(success) {
			//console.log(success);
		};

		page.open(options.url,
			function(err,status) {
				//console.log(err,status,options.url)
				callback(err,status,stderr);
				ph.exit();	
			});
		});
	});
	};

return exports;
};
