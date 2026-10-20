import alfy from 'alfy'
import { buildCaseItems } from './src/case-output.js'
import {
  findCommand,
  findFilter,
  getClipboardContent,
} from './src/utils.js'

const { inputWithoutFilter, foundFilter: filter } = findFilter(alfy.input)
const { inputWithoutCommand, foundCommand } = findCommand(inputWithoutFilter)
const input = (inputWithoutCommand || getClipboardContent())
  .replaceAll('\t', '\n')
  .split('\n')
  .map(element => element.trim())

function filterOutput(filterText, output) {
  const filterParts = filterText.split(' ')
  for (const filterPart of filterParts)
    output = alfy.matches(filterPart, output, 'match')

  return output
}

const output = buildCaseItems(input, foundCommand)
if (output.length > 0) {
  alfy.output(filter ? filterOutput(filter, output) : output)
}
else {
  alfy.output([
    {
      title: 'Nothing to process…',
      subtitle: 'Maybe the clipboard is empty?',
    },
  ])
}
