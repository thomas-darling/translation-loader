# How to run this example

Note that the following commands could also be added as scripts in `package.json`, which would make them more discoverable.

> ##### Note
> This assumes you already installed the dependencies for this repository, and have the Webpack installed globally.
If that's not the case, run the commands `npm install` and `npm install -g webpack` in this folder before continuing.

## Export

1. Open a command prompt in this folder.

2. Execute the command: `node translate-export`

   This will export all translatable content to the file `./translation/export/translate.json`.

## Build for base locale

1. Open a command prompt in this folder.

2. Execute the command: `webpack`

   This will produce a bundle in the `./artifacts` folder, localized for the base locale in which the source is written, which in this example is `en-US`.

## Build for a specific locale

1. Open a command prompt in this folder.

2. Execute the command: `webpack --env.locale=en-GB`

   This will produce a bundle in the `./artifacts` folder, localized using the translated content from the import file, which in this example is `./translation/import/en-GB.json`.
