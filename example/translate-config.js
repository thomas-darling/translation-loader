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
    excludeGlobs: ["./source/excluded/**"]

    // Note that all paths are relative to the current working directory.
};
