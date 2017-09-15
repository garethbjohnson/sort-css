# Sort CSS Package

Sorts your CSS property lines in Atom. Never gets tired.

### Installation

???

### Commands and Keybindings

All of the following commands are under the `atom-text-editor` selector.

If any lines are selected in the active buffer, the commands operate on the selected lines. Otherwise, the commands operate on all lines in the active buffer.

|Command|Description|Keybinding|
|-------|-----------|----------|
|`sort-css:sort`|Sorts the lines (case sensitive)|<kbd>F5</kbd>
|`sort-css:case-insensitive-sort`|Sorts the lines (case insensitive)|
|`sort-css:natural`|Sorts the lines (["natural" order](https://www.npmjs.com/package/javascript-natural-sort))|
|`sort-css:reverse-sort`|Sorts the lines in reverse order (case sensitive)|
|`sort-css:unique`|Removes duplicate lines|

Custom keybindings can be added by referencing the above commands.  To learn more, visit the [Using Atom: Basic Customization](http://flight-manual.atom.io/using-atom/sections/basic-customization/#customizing-keybindings) or [Behind Atom: Keymaps In-Depth](http://flight-manual.atom.io/behind-atom/sections/keymaps-in-depth) sections in the flight manual.
