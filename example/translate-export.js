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
    ...translateConfig.excludeGlobs.map(glob => "!" + path.join(__dirname, glob))
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
