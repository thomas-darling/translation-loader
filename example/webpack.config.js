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
    },
    resolveLoader:
    {
        alias:
        {
            "translation-loader": path.join(__dirname, '../lib/index'),
        },
    }
};
