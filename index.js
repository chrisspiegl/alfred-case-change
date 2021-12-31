import path from 'node:path';
import fs from 'node:fs';
import alfy from 'alfy';
import {camelCase, pascalCase, sentenceCase, paramCase, capitalCase} from 'change-case';
import {upperCase} from 'upper-case';
import {lowerCase} from 'lower-case';
import {titleCase} from 'title-case';
import {
	filterOutput,
	findFilter,
	isFileActionCaseSensitive,
	getClipboardContent,
	findCommand,
} from './src/utils.js';

const {inputWithoutFilter, foundFilter: filter} = findFilter(alfy.input);
const {inputWithoutCommand, foundCommand} = findCommand(inputWithoutFilter);
const input = (inputWithoutCommand || getClipboardContent())
	.replaceAll('\t', '\n')
	.split('\n')
	.map(element => element.trim());

const options = [
	{
		prefix: titleCase('title case'),
		match: 'titleCase',
		action: line => titleCase(line),
	},
	{
		prefix: upperCase('upper case'),
		match: 'upperCase',
		action: line => upperCase(line),
	},
	{
		prefix: lowerCase('lower case'),
		match: 'lowerCase',
		action: line => lowerCase(line),
	},
	{
		prefix: camelCase('camel case'),
		match: 'camelCase',
		action: line => camelCase(line),
	},
	{
		prefix: pascalCase('pascal case'),
		match: 'pascalCase',
		action: line => pascalCase(line),
	},
	{
		prefix: sentenceCase('sentence case'),
		match: 'sentenceCase',
		action: line => sentenceCase(line),
	},
	{
		prefix: paramCase('param case'),
		match: 'paramCase',
		action: line => paramCase(line),
	},
	{
		prefix: capitalCase('capital case'),
		match: 'capitalCase',
		action: line => capitalCase(line),
	},
];

function run(input) {
	if (isFileActionCaseSensitive(input) && !foundCommand) {
		return [
			{
				title: 'File or Folder Name',
				valid: false,
				autocomplete: `!name ${input.join('\t')}`,
			},
			{
				title: 'Extension',
				valid: false,
				autocomplete: `!ext ${input.join('\t')}`,
			},
			{
				title: 'File or Folder Name and Extension',
				valid: false,
				autocomplete: `!both ${input.join('\t')}`,
			},
		];
	}

	const isFileAction = isFileActionCaseSensitive(input);
	return options.map(options => {
		const result = input.map(line => {
			if (isFileAction) {
				let inputBefore;
				let inputAfter;
				const dir = path.dirname(line);
				const stat = fs.lstatSync(line);
				if (stat.isDirectory()) {
					if (foundCommand === 'ext') {
						// ignore directories when processing only the file extension
						return false;
					}

					const name = path.basename(line);
					inputBefore = name;
					inputAfter = options.action(name);
				} else {
					const {name} = path.parse(line); //=> "hello"
					const ext = path.parse(line)?.ext?.slice(1); //=> ".html"
					inputBefore = name + ext;
					switch (foundCommand) {
						case 'name':
							inputAfter = options.action(name) + '.' + ext;
							break;

						case 'ext':
							inputAfter = name + '.' + options.action(ext);
							break;

						default:
							inputAfter = options.action(name) + '.' + options.action(ext);
							break;
					}
				}

				return {
					inputBefore,
					inputAfter,
					before: line,
					after: path.resolve(dir, inputAfter),
				};
			}

			const inputAfter = options.action(line);
			return {
				inputBefore: line,
				inputAfter,
				before: line,
				after: options.action(line),
			};
		}).filter(element => Boolean(element));
		return {
			title: `${options.prefix}: ${result.map(element => element.inputAfter).join('\n')}`,
			subtitle: 'Copy to clipboard',
			match: options.match,
			arg: result.map(element => element.after),
			mods: {
				cmd: isFileAction
					? {
						subtitle: 'Rename file(s)',
						arg: JSON.stringify(result),
						variables: {
							action: 'rename',
						},
					}
					: {
						subtitle: 'Paste case changed into front most app',
						variables: {
							action: 'paste',
						},
					},
			},
		};
	});
}

const output = run(input);
if (output.length > 0) {
	alfy.output(filter ? filterOutput(filter, output) : output);
} else {
	alfy.output([
		{
			title: 'Nothing to process…',
			subtitle: 'Maybe the clipboard is empty?',
		},
	]);
}
