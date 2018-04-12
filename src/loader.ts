import * as path from "path";
import * as loaderUtils from "loader-utils";
import * as minimatch from "minimatch";
import { ILoaderOptions } from "./loader-options";

/* tslint:disable: no-submodule-imports */
import { Plugin } from "gulp-translate/lib/plugin/plugin";
/* tslint:enable */

/**
 * Represents the loader function that will be called by Webpack.
 * @param fileContents The contents of the file being loaded.
 */
export function loader(fileContents: string): string | void
{
    // Get the options for the translate plugin and import task.
    const options = (loaderUtils.getOptions(this) || {}) as ILoaderOptions;

    // Get the path and base path of the file being loaded.
    const filePath = this.resourcePath;

    // Skip the import if the file path matches any exclude globs.
    if (options.excludeGlobs != null)
    {
        const excludeGlobs = options.excludeGlobs.map(glob => path.join(process.cwd(), glob));

        if (excludeGlobs.some(glob => minimatch.match([filePath], glob).length > 0))
        {
            return fileContents;
        }
    }

    // Add the import file as a dependency for the file being loaded.
    this.addDependency(options.importFilePath);

    // Create the translate plugin, import task and file.
    const task = new Plugin(options).import(options);
    const file = { contents: fileContents, path: filePath };

    // Execute the import task.

    const callback = this.async();

    task.process(file)
        .then(processedFile => callback(null, processedFile.contents))
        .catch(callback);
}
