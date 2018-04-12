translation-loader
==================

[![Version](https://img.shields.io/npm/v/translation-loader.svg)](https://www.npmjs.org/package/translation-loader)
[![Downloads](https://img.shields.io/npm/dm/translation-loader.svg)](https://www.npmjs.com/package/translation-loader)
[![Try on RunKit](https://badge.runkitcdn.com/translation-loader.svg)](https://runkit.com/npm/translation-loader)

Webpack loader that injects translated content into HTML templates and JSON files.

This is build on top of the core import functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate),
allowing that same workflow to be used together with a Webpack based build process, in which templates and JSON files
will be localized when they are loaded by Webpack.

Please refer to the docs for [gulp-translate](https://www.npmjs.com/package/gulp-translate) for details on capabilities and configuration.<br>
Note that the repository for this loader also contains an example illustrating how this may be used.

## What about the export?

While this loader handles the import of translations, you will also need to export your content for translation.
The recommended way to do that, is to either use [gulp-translate](https://www.npmjs.com/package/gulp-translate) together with a Gulp task, or if you do not wish to take a dependency
on Gulp, to write a simple `package.json` script that uses the core export functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate) directly.

## Example

The following is an example of how this loader might be used in a Webpack configuration,
together with a `package.json` script for exporting content for translation.

### `webpack.config.js`

```javascript
const path = require("path");
const translateConfig = require("./translate-config");

module.exports =
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
```

### `translate-export.js`

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
        .map(glob => "!" + path.join(__dirname, glob))
]);

// Create the translate plugin and export task.
const task = new translate.Plugin(translateConfig).export(translateConfig);

// Process the source files.
for (let filePath of filePaths)
{
    const fileContents = fs.readFileSync(filePath);
    const file = { contents: fileContents, path: filePath };
    task.process(file);
}

// Finalize the task.
task.finalize();
```

### `translate-config.js`

```javascript
module.exports =
{
    // This is where the options for gulp-translate are specified.
    // Note how the plugin and command options are all in the same object,
    // instead of being separated as in the gulp-translate documentation.
    prefixIdsInContentFiles: true,
    preserveAnnotations: "none",
    baseFilePath: "./source",
    importFilePath: "./translation/import/translation.json",
    exportFilePath: "./translation/export/translation.json",

    // This option is specific to this loader and not part of gulp-translate.
    // It allows you to specify glob patterns for files for which import
    // and export should be skipped, e.g. because they belong to a feature
    // that is not yet ready for translation.
    excludeGlobs: ["./unfinished-feature/**"]

    // Note that all paths are relative to the current working directory.
};
```

### Finally, add this to your `package.json` file

```js
"scripts":
{
  "build": "webpack",
  "export": "node translate-export.js"
}
```

This allows you to build your project by executing the command `node build`,
and to export strings for translation by executing the command `node export`.
