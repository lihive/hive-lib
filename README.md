# hive-lib

Data structures for the game of Hive.

## Tools

The development environment includes a number of tools that are useful for the development/debugging of `hive-lib`
functionality. They can also be quite useful for understanding how the library works and what functionality it provides
(and does not provide).

Scripts to run the tools are provided in the `package.json` file, and are prefixed with `tool:`. Tools can, of course,
be built to run as a standalone page using `vite build [path/to/tool]`. Note that you may need to adjust the `base` 
value of `vite.config.js` for the tool depending on where you intend to serve the tool from.
