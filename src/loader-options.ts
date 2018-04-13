/* tslint:disable: no-submodule-imports */
import { IPluginConfig } from "gulp-translate/lib/plugin/plugin-config";
import { IImportTaskConfig } from "gulp-translate/lib/plugin/import/import-task-config";
import { IExportTaskConfig } from "gulp-translate/lib/plugin/export/export-task-config";
/* tslint:enable */

/**
 * Represents the options for the loader.
 */
export interface ILoaderOptions extends IPluginConfig, IImportTaskConfig, IExportTaskConfig
{
    /**
     * True to skip importing, and just pass through the base content,
     * false to import normally. Note that if you explicitly enable this,
     * you may set the `importFilePath` to an empty array.
     * Default is false.
     */
    skipImport?: boolean;

    /**
     * An array of glob patterns matching files that should be excluded from import and export.
     * Use this to exclude files related to features that are not yet ready for translation.
     * Default is undefined.
     */
    excludeGlobs?: string[];
}
