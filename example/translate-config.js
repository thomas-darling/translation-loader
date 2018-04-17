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
