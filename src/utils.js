import cp from 'node:child_process'
import { discoverPathSync } from 'discover-path'

export function isFileActionCaseSensitive(input) {
  const filePaths = input
    .filter(element => Boolean(element.trim()))
    .filter((filepath) => {
      if (filepath.slice(0, 1) !== '/')
        return false

      return fileExistsWithCaseSync(filepath.trim())
    })
  return filePaths.length > 0
}

export function fileExistsWithCaseSync(filepath) {
  try {
    return Boolean(discoverPathSync(filepath.trim()))
  }
  catch {
    return false
  }
}

export function getClipboardContent() {
  return cp.spawnSync('pbpaste', {
    encoding: 'utf8',
  }).stdout
}

export function findCommand(input) {
  const regexCommand = /^(!(?<command>[a-z]*))?/i
  const regexMatches = input.trim().match(regexCommand)
  const foundCommand = regexMatches?.groups.command
  const inputWithoutCommand = input.trim().replace(regexCommand, '')
  return {
    inputWithoutCommand,
    foundCommand,
  }
}

export function findFilter(input) {
  const regexFilter = /(!(?<filter>[a-z ]*))?$/i
  const regexMatches = input.trim().match(regexFilter)
  const foundFilter = regexMatches?.groups.filter
  const inputWithoutFilter = input.trim().replace(regexFilter, '')
  return {
    inputWithoutFilter,
    foundFilter,
  }
}
