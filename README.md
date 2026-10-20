# alfred-case-change

Alfred workflow to change the case of selected text, filenames, and the current clipboard item.

It runs in Alfred 5 with the Powerpack. Choose a case (title, upper, lower, camel, pascal, sentence, param, or capital). Enter copies the result. Hold Command to paste text into the frontmost app, or to rename files after choosing a name, extension, or both.

## Install

Requires Node.js 20+ (verified on 24) and [Alfred 5](https://alfredapp.com) with the [Powerpack](https://alfredapp.com/powerpack/).

```bash
npm install --global alfred-case-change
```

## Usage

*Careful: processing filenames is not reversible!*

* You can use this workflow as a Universal Action on selected text, invoke the keyword by typing `case` in Alfred, or open it from the Alfred File Browser by typing `Case change`.
* The workflow detects whether it is processing files or standard text.
* When processing files it asks whether to change the extension, the filename, or both.
* When processing files the default action copies the new filenames. Hold <kbd>Command</kbd> to rename the files on disk.
* When processing text, the default action copies to the clipboard. Hold <kbd>Command</kbd> to paste the case-changed text into the frontmost app.
* Filter the case list by entering `!title`, `!upp`, and similar tokens after the text or filenames.

## Maintainer

```bash
pnpm install
pnpm lint
pnpm test
pnpm release
```

## Release

From a clean main checkout, `pnpm release` prompts for the version, publishes to npm with pnpm, and creates the GitHub release. Requires npm login and a GitHub token (`GITHUB_TOKEN`) or `gh` auth.

## Related

* [More Alfred Workflows](https://github.com/chrisspiegl/alfred-workflows) - My Alfred Workflow Directory
* [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease
* [Case Converter](https://www.alfredforum.com/topic/2180-case-converter-including-title-case/) - Inspiration for this workflow comes from the work done by [dfay](http://dfay.fastmail.fm/)
