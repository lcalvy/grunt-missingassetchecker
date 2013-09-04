var page = require('webpage').create(),
    system = require('system'),
    t, address;

if (system.args.length === 1) {
    console.log('Usage: loadspeed.js <some URL>');
    phantom.exit();
}

t = Date.now();
address = system.args[1];

page.viewportSize = { width: 1280, height: 1024 };

page.onConsoleMessage = function (msg) {
    console.warn("console.log in source code :", msg);
};

page.onError = function(msg, trace) {
    var msgStack = ['JAVASCRIPT ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.error(msgStack.join('\n'));
};

page.onResourceReceived = function (response) {
	
    if(response.status >=400 && response.status <600 && response.stage === "start"){
		console.error("NETWORK ERROR: Receive failed", response.status, "on request url",response.url);
    }
    
};

page.open(address, function (status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        t = Date.now() - t;
        console.log('Loading time ' + t + ' msec');
    }
    page.render('example.png');
    phantom.exit();
});
