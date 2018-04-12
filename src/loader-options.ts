/* tslint:disable: no-submodule-imports */
import { IPluginConfig } from "gulp-translate/lib/plugin/plugin-config";
import { IImportTaskConfig } from "gulp-translate/lib/plugin/import/import-task-config";
/* tslint:enable */

/**
 * Represents the options for the loader.
 */
export interface ILoaderOptions extends IPluginConfig, IImportTaskConfig
{
    /**
     * An array of glob patterns matching files that should be excluded from import and export.
     * Use this to exclude files related to features that are not yet ready for translation.
     */
    excludeGlobs?: string[];
}
