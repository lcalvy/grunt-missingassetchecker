# grunt-missingassetchecker

The Grunt plugin helps to find missing assets in web-applications. Generates HTML reports, screenshots for each URL, support failure threshold.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-missingassetchecker --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-missingassetchecker');
```

## The "missingassetchecker" task

### Overview
In your project's Gruntfile, add a section named `missingassetchecker` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  missingassetchecker: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.url
Type: `String`
Default value: `'http://localhost:9000`

A string value that is used to start browsing and check for errors

#### options.issues
Type: `Array`
Default value: `['networkerror','javascripterror','console']`

An array of values that launch different kinds of tests.

### Usage Examples

#### Minimal configuration
In this example, the default options are used to test static html pages hosted on localhost server on port 9000 checking if assets any assets are missing. If there is at least 1 missing asset for the specified pages, grunt task will fail.

```js
grunt.initConfig({
        missingassetchecker: {
            product_pages: {
                options: {
                    "issues" : ["networkerror"],
                    "urls": [
                        'https://localhost:9000/product-page1.html',
                        'https://localhost:9000/product-page2.html'
                    ],
                    "report": 'reports/missingassetchecker'
                }
            }
        }
    });
```


#### Default configuration
There are various options available to customize configuration of underlying phantomjs and enhance generated reports.

```js
grunt.initConfig({
        missingassetchecker: {
            product_pages: {
                "options": {
                    "urls": [
                        'https://localhost:9000/product-page1.html',
                        'https://localhost:9000/product-page2.html'
                    ],
                    issues: ['networkerror'],
                    failThreshold: 0,
                    resourceFilter: function (resourceUrl) {
                        return true;
                    },
                    report: 'reports/missingassetchecker',
                    screenshots: 'reports/missingassetchecker/screenshots',
                    phantom: {
                        maxOpenPages: 5,
                        cliOptions: {
                            'load-images': 'true',
                            'ignore-ssl-errors': 'true',
                            'local-to-remote-url-access': 'true',
                            'ssl-protocol': 'tlsv1'
                        },
                        settings: {
                            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36',
                            viewportSize: {width: 1280, height: 1024}
                        }
                    }
                }
            }
        }
    });
```

 - **urls** - list of URLs
 - **issues**  - types of errors to capture. Full configuration ["networkerror", "javascripterror", "console"]. NOTE:  "javascript" and "console" can't function until [this issue](https://github.com/sgentle/phantomjs-node/issues/287) is resolved in phantomjs itself.
 - **failThreshold** - grunt task won't fail if number of found issues is less then specified threshold
 - **reports** - directory where HTML + JSON reports will be saved
 - **screenshots** - directory where screenshots for each analyzed URL will be saved
 - **resourceFilter** - filter function, which is executed for each requested asset on the page. It can be used, i.e. if you need to avoid certain requests (i.e. web analytics, etc). 
 - **phantom** - configuration for phantomjs (UA, max number of open URLs,  CLI options). Please see above configuration, all parameters are self-explanatory.


## How it works
Gruntmissingassetchecker opens each URL in the Phantomjs (headless Webkit browser), captures all resource errors using onResourceError handler from PhantomJS API. List of captured errors is then being passed back to the grunt task, which in turn generates JSON report + HTML report. 

## Contributing
Please fill to contribute in master branch and pull request updates or fixes.

## Release History
0.2.0
Switched to "phantom" module from "node-phantom"
Added HTML reports generation feature
Added Screenshots generation feature
Added multiple URLs support
Widen list of supported network issues

0.1.3
Better log and verbose formatting

0.1.2
Fix dependency to node-phantom

0.1.1
Description fix

0.1.0
First release
