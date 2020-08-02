const path = require("path");
const translateConfig = require("./translate-config");

/**
 * The Webpack configuration.
 */
const webpackConfig =
{
    mode: "production",
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
                    { loader: "html-loader", options: { minimize: false } },
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
    },

    // This is only needed because we are referencing the local build output.
    // If the loader was installed as an NPM package, this would not be needed.
    resolveLoader:
    {
        alias:
        {
            "translation-loader": path.resolve("../lib/index"),
        },
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
