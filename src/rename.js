import {renameSync} from 'node:fs';
import alfy from 'alfy';
import {fileExistsWithCaseSync} from './utils.js';

console.log(alfy.input);

const inputArgs = JSON.parse(alfy.input);

for (const element of inputArgs) {
	if (
		fileExistsWithCaseSync(element.before)
    && !fileExistsWithCaseSync(element.after)
	) {
		renameSync(element.before, element.after);
	}
}
