'use strict'
//var path = require('path')
//var phantomjs = require('phantomjs')
//var childProcess = require('child_process')

var phantom = require('phantom');


var phantomlauncher = module.exports = function () {
};


phantomlauncher.prototype.launch = function log(options,callback) {

phantom.create(function(ph) {
  ph.createPage(function(page) {
  
	page.set('onConsoleMessage',function (msg) {
	    console.warn("console.log in source code :", msg);
	});

	page.set('onError', function(msg, trace) {
	    var msgStack = ['JAVASCRIPT ERROR: ' + msg];
	    if (trace && trace.length) {
	        msgStack.push('TRACE:');
	        trace.forEach(function(t) {
	            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	        });
	    }
	    console.error(msgStack.join('\n'));
	});

	page.set('onResourceReceived', function (response) {
		
	    if(response.status >=400 && response.status <600 && response.stage == "start"){
			console.error("NETWORK ERROR: Receive failed", response.status, "on request url",response.url);
	    };
	    
	});

  	page.set('onLoadFinished', function(success) {
  		callback(null,"Finished",null);
  	});

    page.open(options.url,
      function(status) {
        console.log('Opened site? %s', status);
       	ph.exit();	
      });
  });
});
};
