# alfred-case-change

> [Alfred](https://alfredapp.com) workflow to change case on selected text, filenames, and more

<img src="media/screenshot.png" style="width: 100%;">

Change the case of selected text, filenames, and your current clipboard item.

## Install

```bash
npm install --global alfred-case-change
```

*Requires [Node.js](https://nodejs.org) 14+ and the Alfred [Powerpack](https://alfredapp.com/powerpack/).*

## Usage

*Careful: processing filenames is not reversible!*

* You can use this workflow as a Universal Action on selected text, invoke the keyword by typing `case` in your Alfred search or in the Alfred File Browser by typing `Case change`.
* The workflow automatically detects if it's processing files or standard text.
* When processing files it will ask if you want to change the extension, the filename, or both.
* When processing files the default action is to copy the new filenames but you can also hold down <kbd>Command</kbd> so that the files are actually renamed (note: this is not reversible so be careful).
* When processing standard text via the keyword or Universal Action the default action is to copy to clipboard but holding down <kbd>Command</kbd> will paste the case changed text to the front most app.
* You can filter the case selection by entereing `!title`, `!upp`, etc. after the text or filenames in Alfred Search.

## Related

* [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
* [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease
* [Case Converter](https://www.alfredforum.com/topic/2180-case-converter-including-title-case/) - Inspiration for this workflow comes from the work done by [dfay](http://dfay.fastmail.fm/)
