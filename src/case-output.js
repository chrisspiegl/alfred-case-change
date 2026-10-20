import fs from 'node:fs'
import path from 'node:path'
import { camelCase, capitalCase, paramCase, pascalCase, sentenceCase } from 'change-case'
import { lowerCase } from 'lower-case'
import { titleCase } from 'title-case'
import { upperCase } from 'upper-case'
import { isFileActionCaseSensitive } from './utils.js'

export function joinNameAndExtension(name, extension) {
  if (!extension)
    return name

  return `${name}.${extension}`
}

function readStat(filePath) {
  try {
    return fs.lstatSync(filePath)
  }
  catch {
    return undefined
  }
}

export function buildCaseItems(input, foundCommand) {
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
    ]
  }

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
  ]

  const isFileAction = isFileActionCaseSensitive(input)
  return options.map((option) => {
    const result = input.map((line) => {
      if (isFileAction) {
        const stat = readStat(line)
        if (!stat)
          return false

        const directory = path.dirname(line)
        let inputBefore
        let inputAfter
        if (stat.isDirectory()) {
          if (foundCommand === 'ext')
            return false

          const name = path.basename(line)
          inputBefore = name
          inputAfter = option.action(name)
        }
        else {
          const parsed = path.parse(line)
          const { name } = parsed
          const extension = parsed.ext ? parsed.ext.slice(1) : ''
          inputBefore = name + extension
          switch (foundCommand) {
            case 'name':
              inputAfter = joinNameAndExtension(option.action(name), extension)
              break
            case 'ext':
              inputAfter = joinNameAndExtension(name, option.action(extension))
              break
            default:
              inputAfter = joinNameAndExtension(option.action(name), option.action(extension))
              break
          }
        }

        return {
          inputBefore,
          inputAfter,
          before: line,
          after: path.resolve(directory, inputAfter),
        }
      }

      const inputAfter = option.action(line)
      return {
        inputBefore: line,
        inputAfter,
        before: line,
        after: option.action(line),
      }
    }).filter(element => Boolean(element))

    return {
      title: `${option.prefix}: ${result.map(element => element.inputAfter).join('\n')}`,
      subtitle: 'Copy to clipboard',
      match: option.match,
      arg: result.map(element => element.after).join('\n'),
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
    }
  })
}
