'use strict';
//var path = require('path')
//var phantomjs = require('phantomjs')
//var childProcess = require('child_process')

var phantom = require('phantom');
var path = require('path');

// NOTE: status here is not just HTTP status! It is also internal connection status code
// @see full list of the codes: https://github.com/ariya/phantomjs/blob/master/src/qt/qtbase/src/network/access/qnetworkreply.h#L67
// Also @see https://github.com/ariya/phantomjs/issues/13245#issuecomment-103377176
var errorBuckets = {
    'network_layer_error': [1, 99],
    'proxy_error': [101, 199],
    'content_error': [201, 299],
    'protocol_error': [301, 399],
    'server_side_error': [401, 499]
};
// @see taken from http://doc.qt.io/qt-4.8/qnetworkreply.html
var errorDescriptions = {
    1: "the remote server refused the connection (the server is not accepting requests)",
    2: "the remote server closed the connection prematurely, before the entire reply was received and processed",
    3: "the remote host name was not found (invalid hostname)",
    4: "the connection to the remote server timed out",
    5: "the operation was canceled via calls to abort() or close() before it was finished. It happens, i.e. with assets on page if there is client-side redirect to another page.",
    6: "the SSL/TLS handshake failed and the encrypted channel could not be established. The sslErrors() signal should have been emitted.",
    7: "the connection was broken due to disconnection from the network, however the system has initiated roaming to another access point. The request should be resubmitted and will be processed as soon as the connection is re-established.",
    101: "the connection to the proxy server was refused (the proxy server is not accepting requests)",
    102: "the proxy server closed the connection prematurely, before the entire reply was received and processed",
    103: "the proxy host name was not found (invalid proxy hostname)",
    104: "the connection to the proxy timed out or the proxy did not reply in time to the request sent",
    105: "the proxy requires authentication in order to honour the request but did not accept any credentials offered (if any)",
    201: "the access to the remote content was denied (similar to HTTP error 401)",
    202: "the operation requested on the remote content is not permitted",
    203: "the remote content was not found at the server (similar to HTTP error 404)",
    204: "the remote server requires authentication to serve the content but the credentials provided were not accepted (if any)",
    205: "the request needed to be sent again, but this failed for example because the upload data could not be read a second time.",
    301: "the Network Access API cannot honor the request because the protocol is not known",
    302: "the requested operation is invalid for this protocol",
    99: "an unknown network-related error was detected",
    199: "an unknown proxy-related error was detected",
    299: "an unknown error related to the remote content was detected",
    399: "a breakdown in protocol was detected (parsing error, invalid or unexpected responses, etc.)"
}

function generateScreenshotName(url){
    return url.replace(/[^a-z0-9]/gi, '_');
}

exports.init = function (grunt) {

    var exports = {};
    exports.launch = function (options, pageUrl, callback) {

        var stderr = [];
        var abortedRequests = [];
        var abortedRequestsIs = [];

        phantom.create(
            {
                parameters: options.phantom.cliOptions
            },
            function (ph, err) {

                //if (err) {
                //    callback(err, null, stderr, abortedRequests);
                //    return;
                //}
                ph.createPage(function (page, err) {
                    //if (err) {
                    //    callback(err, null, stderr, abortedRequests);
                    //    return;
                    //}

                    //page.set('settings.resourceTimeout', 1000);
                    //TODO: make it configurable
                    page.set('settings.userAgent', options.phantom.settings.userAgent);
                    page.set('viewportSize', options.phantom.settings.viewportSize);

                    page.set('onConsoleMessage', function (msg) {
                        //console.warn("console.log in source code :", msg);
                        stderr.push({type: "console", message: msg});
                    });

                    page.set('onError', function (msg, trace) {
                        //var msg = err[0];
                        //var trace = err[1];
                        var msgStack = [];

                        if (trace && trace.length) {
                            trace.forEach(function (t) {
                                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                            });
                        }
                        //console.error(msgStack.join('\n'));
                        stderr.push({type: "javascripterror", message: msg, trace: msgStack});
                    });

                    page.onResourceRequested(function (requestData, networkRequest, strResourceFilter) {
                            eval('var resourceFilter=' + strResourceFilter);

                            if (!resourceFilter(requestData.url)) {
                                networkRequest.aborted = true;
                                return networkRequest.abort();
                            }
                        },
                        function (requestData) {

                            if (!options.resourceFilter(requestData.url)) {
                                grunt.log.writeln('ABORTED request [id=' + requestData.id + ']"' + requestData.url + '" because of filter');
                                abortedRequests.push({
                                    resourceUrl: requestData.url
                                });
                                abortedRequestsIs.push(requestData.id);
                            }
                        },
                        options.resourceFilter.toString());


                    page.set('onResourceError', function (resourceError) {
                        var errorCode = resourceError.errorCode;
                        var bucket, foundBucket;

                        // checking if this resource was explicitly aborted with filter,
                        // and not counting it as an error
                        if (abortedRequestsIs.indexOf(resourceError.id) !== -1) {
                            return;
                        }

                        // identifying error category
                        for (bucket in errorBuckets) {

                            if (errorCode >= errorBuckets[bucket][0] && errorCode <= errorBuckets[bucket][1]) {
                                foundBucket = bucket;
                                break;
                            }
                        }

                        if (foundBucket) {
                            stderr.push({
                                    type: "networkerror",
                                    errorCode: errorCode,
                                    errorType: foundBucket,
                                    pageUrl: pageUrl,
                                    resourceUrl: resourceError.url,
                                    message: errorDescriptions[errorCode],
                                }
                            )
                            ;
                        }
                    });

                    page.set('onLoadFinished', function (success) {
                        grunt.log.ok('Load finished (' + success + ') for ' + pageUrl);
                    });

                    //TODO: detect and report client-side redirects
                    // @see https://github.com/ariya/phantomjs/issues/10389
                    //page.set('onUrlChanged', function(){
                    //    stderr.push({
                    //        type: 'redirect',
                    //        status: 'redirect',
                    //        pageUrl: pageUrl,
                    //        resourceUrl: null
                    //    });
                    //});

                    page.open(pageUrl,

                        function (/*err, */status) {
                            //console.log(/*err,*/status, pageUrl)
                            //page.close(); // tend to cause crashes
                            //console.log(abortedRequests);
                            // without setTimeout PhantomJS is intermittently crashubg
                            if (status === status && options.screenshots) {
                                var filePath = path.join(process.cwd(), options.screenshots, generateScreenshotName(pageUrl)) + '.png';
                                page.render(filePath);
                                grunt.log.ok('Screenshot is saved to ' + filePath);
                            }
                            setTimeout(function () {
                                ph.exit(0);
                            }, 0)
                            callback(undefined, status, stderr, abortedRequests);
                        });
                });
            }
        )
        ;
    };

    return exports;
};
