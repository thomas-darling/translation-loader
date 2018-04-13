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
    },

    // This is just needed because we are referencing the local build output.
    // If the loader was installed as an NPM package, it would not be needed.
    resolveLoader:
    {
        alias:
        {
            "translation-loader": path.join(__dirname, '../lib/index'),
        },
    }
};

// Handle command line arguments and return the webpack configuration.
module.exports = function(env)
{
    if (env && env.locale)
    {
        // To build for the specified locale, set the import file path.
        translateConfig.importFilePath = `./translation/import/${env.locale}.json`;
    }
    else
    {
        // To build for the base locale, just skip the import.
        translateConfig.skipImport = true;
    }

    return webpackConfig;
};
