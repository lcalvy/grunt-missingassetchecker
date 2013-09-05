# grunt-missingassetchecker

> Check if app is missing assets or assets is not available. Task can be configured to check different kind of problems : javascript error, network error or console message

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

#### Default Options
In this example, the default options are used to test localhost server on port 9000 checking if assets are missing, javascript error occured or debug message are present in console.

```js
grunt.initConfig({
  missingassetchecker: {
      options: {
        issues : ["javascripterror","networkerror","console"]
      },
      home: {
        options: {
          url: 'http://localhost:9000/',
          
        },
      }
    },
})
```

#### Custom Options
In this example, custom options are used to test only network errors on pages and javascripterror on another page.

```js
grunt.initConfig({
  missingassetchecker: {
      options: {
        issues : ["networkerror"]
      },
      home: {
        options: {
          url: 'http://localhost:9000/',
          
        },
      },
      javascripterror: {
        options: {
          url: 'http://localhost:9000/javascripterror.html',
          issues : ["javascripterror"]
          
        },
      },
    },
})
```

## Contributing
Please fill to contribute in master branch and pull request updates or fixes.

## Release History
0.1.3
Better log and verbose formatting

0.1.2
Fix dependency to node-phantom

0.1.1
Description fix

0.1.0
First release
