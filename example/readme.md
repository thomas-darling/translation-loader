# How to run this example

Note that in a real project, the following commands could be added as scripts
in `package.json`, which would make them more discoverable and easier to use.

## Export

1. Open a command prompt in this folder.

2. Execute the command: `node translate-export`

   This will export content to the file `./translation/export/translation.json`.

## Import

1. Open a command prompt in this folder.

2. Execute the command: `webpack`

   This will import content from the file `./translation/import/translation.json`
   and produce a localized bundle in the `./artifacts` folder.
