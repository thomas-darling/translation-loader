import * as path from "path";
import * as loaderUtils from "loader-utils";
import * as minimatch from "minimatch";
import * as webpack from "webpack";
import { ILoaderOptions } from "./loader-options";

/* tslint:disable: no-submodule-imports */
import { Plugin } from "gulp-translate/lib/plugin/plugin";
/* tslint:enable */

/**
 * Represents the loader function that will be called by Webpack.
 * @param fileContents The contents of the file being loaded.
 */
export function loader(this: webpack.loader.LoaderContext, fileContents: string): string | void
{
    // Get a copy of the options for the translate plugin and import task.
    const options = { ...loaderUtils.getOptions(this) } as ILoaderOptions;

    // Get the path of the file being loaded.
    const filePath = this.resourcePath;

    let skipImport = false;

    // Skip the import if the file path matches any exclude globs.
    if (options.excludedFilePaths != null)
    {
        const excludeGlobs = options.excludedFilePaths.map(glob => path.resolve(glob));

        if (excludeGlobs.some(glob => minimatch.match([filePath], glob).length > 0))
        {
            skipImport = true;
        }
    }

    if (!skipImport)
    {
        // Add the import file as a dependency for the file being loaded.
        if (options.importFilePath instanceof Array)
        {
            for (const importFilePath of options.importFilePath)
            {
                this.addDependency(importFilePath);
            }
        }
        else if (options.importFilePath != null)
        {
            this.addDependency(options.importFilePath);
        }
    }
    else
    {
        // We need the export task to clean the templates, but we don't want to actually export anything.
        options.exportFilePath = undefined;
    }

    // Create the translate plugin.
    const plugin = new Plugin(options);

    // Create the task, which may be either an import task or an export task, depending on whether the import
    // should be skipped or not. If the import is skipped, the export task will simply clean the templates.
    const task = skipImport ? plugin.export(options) : plugin.import(options);

    // Create the file to be processed.
    const file = { contents: fileContents, path: filePath };

    // Process the file.

    const callback = this.async()!;

    task.process(file)
        .then(processedFile => callback(null, processedFile.contents))
        .catch(callback);
}
