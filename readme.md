translation-loader
==================

[![Version](https://img.shields.io/npm/v/translation-loader.svg)](https://www.npmjs.org/package/translation-loader)
[![Downloads](https://img.shields.io/npm/dm/translation-loader.svg)](https://www.npmjs.com/package/translation-loader)
[![Try on RunKit](https://badge.runkitcdn.com/translation-loader.svg)](https://runkit.com/npm/translation-loader)

Webpack loader that localizes HTML templates and JSON files by injecting translated content.

This is build on top of the core import functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate), allowing that same workflow to be used together with a Webpack based build process, in which templates and JSON files will be localized when they are loaded by Webpack.

Please refer to the docs for [gulp-translate](https://www.npmjs.com/package/gulp-translate) for details on capabilities and configuration.

## What about the export?

While this loader handles the import of translations, you will also need to export your content for translation. The recommended way to do that, is to either use [gulp-translate](https://www.npmjs.com/package/gulp-translate) in a Gulp task, or if you do not wish to take a dependency on Gulp, to write a simple `package.json` script that uses the core export functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate) directly.

## Example

The following example illustrates how this loader may be used in a Webpack configuration, as well as how a `package.json` script for exporting content may be written. Note the code shown here also exists as a working example in the repository for this package.

### `webpack.config.js`

Let's say you have a webpack configuration that looks like the example below. Note how the templates and JSON content files are piped through the `translation-loader`, before being passed to the regular loaders - and yes, Webpack applies the loaders from right to left, so the order shown here is correct.

```javascript
const path = require("path");
const translateConfig = require("./translate-config");

// The webpack configuration.
const webpackConfig =
{
    entry: "./source/entry.js",
    output:
    {
        path: path.join(__dirname, "artifacts"),
        filename: "bundle.js"
    },
    module:
    {
        rules:
        [
            {
                test: /\.html$/,
                use:
                [
                    { loader: "html-loader" },
                    { loader: "translation-loader", options: translateConfig }
                ]
            },
            {
                test: /[/\\]content\.json$/,
                use:
                [
                    { loader: "json-loader" },
                    { loader: "translation-loader", options: translateConfig }
                ],
                type: "javascript/auto"
            }
        ]
    }
};

// Handle command line arguments and return the webpack configuration.
module.exports = function(env)
{
    if (env && env.locale)
    {
        // To build for the specified locale, set the import file path.
        translateConfig.importFilePath =
            `./translation/import/${env.locale}.json`;
    }
    else
    {
        // To build for the base locale, just skip the import.
        translateConfig.skipImport = true;
    }

    return webpackConfig;
};
```

### `translate-export.js`

While webpack handles the import and build, you'll also need a way to export the content from your templates and JSON content files, so it can be sent off for translation. This can be done using a script like the example below.

```javascript
const fs = require("fs");
const path = require("path");
const globby = require("globby");
const translate = require("gulp-translate/lib/plugin/plugin");
const translateConfig = require("./translate-config");

// Get the source file paths.
const filePaths = globby.sync(
[
    // Include globs.
    path.join(__dirname, "./source/**/*.html"),
    path.join(__dirname, "./source/**/content.json"),

    // Exclude globs.
    ...translateConfig.excludeGlobs
        .map(glob => `!${path.join(__dirname, glob)}`)
]);

// Create the translate plugin and export task.
const task = new translate.Plugin(translateConfig).export(
{
    ...translateConfig,

    // The path to the export file, to which the content should be exported.
    exportFilePath: "./translation/export/translate.json"
});

// Process the source files.
for (let filePath of filePaths)
{
    const fileContents = fs.readFileSync(filePath);
    const file = { contents: fileContents, path: filePath };
    task.process(file);
}

// Finalize the task.
task.finalize();

// TODO:
// Depending on your workflow, you could consider automatically uploading
// the file to your translation service of choice, and maybe have a similar
// script for downloading the translations once they are ready.
```

### `translate-config.js`

This is the configuration needed during both import and export.

```javascript
module.exports =
{
    // This is where the options for gulp-translate are specified.
    // Note how the plugin and command options are all in the same object,
    // instead of being separated as in the gulp-translate documentation.
    prefixIdsInContentFiles: true,
    preserveAnnotations: "none",
    baseFilePath: "./source",

    // This option is specific to this loader and not part of gulp-translate.
    // It allows you to specify glob patterns matching files for which import
    // and export should be skipped, e.g. because they belong to a feature
    // that is not yet ready for translation.
    excludeGlobs: ["./source/excluded/**"]

    // Note that all paths are relative to the current working directory.
};
```

### How to use

Finally, to make your build tasks more discoverable, you can consider adding something like the following this to your `package.json` file.

```js
"scripts":
{
  "build": "webpack",
  "translate-export": "node translate-export"

  // If you also have a script to download translations...
  "translate-import": "node translate-import"
}
```

With this in place, you can execute the following commands:

* `npm build`<br>
  This will produce a build for the base locale, which could be e.g. `en-US`.

* `npm build --env.locale=en-GB`<br>
  This will produce a build localized for the `en-GB` locale, where the contents of your templates and JSON content files is replaced with the translated content.

* `npm translate-export`<br>
  This will export the contents of your templates and JSON content files into a file that can be sent to translators, who then produce the translation files needed during the build.
