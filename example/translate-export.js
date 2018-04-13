const fs = require("fs");
const path = require("path");
const globs = require("globs");
const translate = require("gulp-translate/lib/plugin/plugin");
const translateConfig = require("./translate-config");

// Get the source file paths.
const filePaths = globs.sync(
[
    // Include globs.
    path.join(__dirname, "./source/**/*.html"),
    path.join(__dirname, "./source/**/content.json"),
],
{
    // Exclude globs.
    ignore: translateConfig.excludeGlobs.map(glob => path.join(__dirname, glob))
});

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
