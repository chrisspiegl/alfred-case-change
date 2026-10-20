import { renameSync } from 'node:fs'
import alfy from 'alfy'
import { renameFromPayload } from './rename-files.js'
import { fileExistsWithCaseSync } from './utils.js'

// Script stdout is the existing Alfred debugger log for the rename payload.
// eslint-disable-next-line no-console
console.log(alfy.input)

const parsed = renameFromPayload(alfy.input, {
  exists: fileExistsWithCaseSync,
  renameSync,
})

if (!parsed.ok)
  console.error('Could not parse the rename payload')
