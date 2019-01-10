translation-loader
==================

[![Version](https://img.shields.io/npm/v/translation-loader.svg)](https://www.npmjs.org/package/translation-loader)
[![Downloads](https://img.shields.io/npm/dm/translation-loader.svg)](https://www.npmjs.com/package/translation-loader)
[![Try on RunKit](https://badge.runkitcdn.com/translation-loader.svg)](https://runkit.com/npm/translation-loader)

Webpack loader that localizes HTML templates and JSON files by injecting translated content, replacing the original content that was previously exported for translation.

This leverages the core functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate), allowing that exact same workflow to be used in a Webpack build process, with no dependency on Gulp.

Please refer to the documentation for [gulp-translate](https://www.npmjs.com/package/gulp-translate) for details on capabilities and configuration.

## What about the export?

While this loader handles the import of translations, you will also need to export your content for translation. The recommended way to do that, is to either use a Gulp task and [gulp-translate](https://www.npmjs.com/package/gulp-translate), or if you do not wish to take a dependency on Gulp, to write a simple script that uses the core export functionality of [gulp-translate](https://www.npmjs.com/package/gulp-translate) directly.

## Example

The following example illustrates how this loader may be used in a Webpack configuration, as well as how a `package.json` script for exporting content may be written. Note that the code shown here also exists as a working example in the repository for this package.

### `webpack.config.js`

Let's say you have a Webpack configuration that looks like the example below. Here the templates and JSON content files are piped through the `translation-loader`, before being passed to the regular loaders.

> Note that Webpack applies the loaders from right to left, so the order shown here is correct.

> Note that Webpack has built in support for JSON files, which is why no JSON loader is needed.

```javascript
const path = require("path");
const translateConfig = require("./translate-config");

/**
 * The Webpack configuration.
 */
const webpackConfig =
{
    entry: "./source/entry.js",
    output:
    {
        path: path.resolve("./artifacts"),

        // This will be set based on the locale for which we are building.
        filename: undefined
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
                    { loader: "translation-loader", options: translateConfig }
                ]
            }
        ]
    }
};

/**
 * Creates the Webpack configuration based on the command line arguments.
 * @param env An object representing the specified 'env' arguments, or undefined.
 * @returns The Webpack configuration to use.
 */
module.exports = function(env)
{
    if (env && env.locale)
    {
        // To build for the specified locale, set the import file path.
        translateConfig.importFilePath =
            translateConfig.importFilePath.replace("{locale}", env.locale);

        // Set the output file name so we get a bundle for each locale.
        webpackConfig.output.filename = `bundle.${env.locale}.js`;
    }
    else
    {
        // To build for the base locale without an import file, exclude all files.
        translateConfig.excludedFilePaths = ["**"];

        // Set the output file name so we get a bundle for each locale.
        webpackConfig.output.filename = "bundle.en-US.js";
    }

    return webpackConfig;
};
```

### `translate-export.js`

While Webpack handles the import and build, you'll also need a way to export the content from your templates and JSON files, so it can be sent off for translation. This can be done using a script like the example below.

```javascript
const fs = require("fs");
const globs = require("globs");
const translatePlugin = require("gulp-translate/lib/plugin/plugin");
const translateConfig = require("./translate-config");

// Get the source file paths.
const filePaths = globs.sync(translateConfig.includedFilePaths,
{
    ignore: translateConfig.excludedFilePaths
});

// Create the export task.
const plugin = new translatePlugin.Plugin(translateConfig);
const task = plugin.export(translateConfig);

// Process the source files.
for (let filePath of filePaths)
{
    const fileContents = fs.readFileSync(filePath);
    const file = { contents: fileContents, path: filePath };

    task.process(file);
}

// Finalize the export task.
task.finalize();
```

Depending on your workflow, you could consider automatically uploading the export file to your translation service of choice, and maybe have a similar script you can run to download the translations once they are ready.

### `translate-config.js`

This file contains the configuration used during both content export translation import.<br>
Please refer to the documentation for [gulp-translate](https://www.npmjs.com/package/gulp-translate) for details.

```javascript
/**
 * The configuration used during content export and translation import.
 * Note that paths must be absolute or relative to the current working directory.
 */
module.exports =
{
    // Options for 'gulp-translate'.
    // Note how the plugin and command options are all in the same object,
    // instead of being separated as in the 'gulp-translate' documentation.

    normalizeContent: true,
    prefixIdsInContentFiles: true,
    baseFilePath: "./source",

    // The path to the export file to which content should be exported.
    exportFilePath: "./translation/export/translate.json",

    // The path to the import file from which content should be imported,
    // where '{locale}' should be replaced with the locale code.
    importFilePath: "./translation/import/{locale}.json",

    // Options for 'translation-loader' and the export script.

    /**
     * An array of glob patterns matching files that should be included in the export.
     * Make sure this matches the tests guarding the use of the 'translation-loader' in your
     * Webpack configuration.
     */
    includedFilePaths:
    [
        "./source/**/*.html",
        "./source/**/content.json"
    ],

    /**
     * An array of glob patterns matching files that should be excluded from import and export.
     * Use this to exclude files related to features that are not yet ready for translation.
     * Default is undefined.
     */
    excludedFilePaths:
    [
        "./source/excluded/**"
    ]
};
```

### How to use

Finally, to make your tasks more discoverable, you can add something like the following to your `package.json` file.

```js
"scripts":
{
  "build": "webpack",
  "translate-export": "node translate-export",
  "translate-import": "node translate-import"
}
```

With this in place, you can execute the following commands:

* `npm run build`<br>
  This will produce a build for the base locale, which could be e.g. `en-US`.

* `npm run build --env.locale=en-GB`<br>
  This will produce a build localized for the `en-GB` locale, where the contents of your templates and JSON files is replaced with the translated content.

* `npm run translate-export`<br>
  This will export the contents of your templates and JSON files into a file that can be sent to translators, who then produce the import files needed during the build.

* `npm run translate-import`<br>
  This would be a convenient way to download the lates translations into your repository.
