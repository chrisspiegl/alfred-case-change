import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { it } from 'vitest'
import { parseRenamePayload, renameFromPayload } from '../src/rename-files.js'
import { fileExistsWithCaseSync } from '../src/utils.js'

function withTempDirectory(run) {
  const directory = mkdtempSync(path.join(tmpdir(), 'case-change-rename-'))
  try {
    return run(directory)
  }
  finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

it('catches invalid rename JSON', () => {
  const result = parseRenamePayload('{')
  assert.equal(result.ok, false)
  assert.deepEqual(result.items, [])
})

it('rejects a JSON value that is not a rename list', () => {
  const result = parseRenamePayload('{"before":"a"}')
  assert.equal(result.ok, false)
  assert.deepEqual(result.items, [])
})

it('does not rename files when JSON.parse fails', () => {
  withTempDirectory((directory) => {
    const source = path.join(directory, 'Hello.txt')
    writeFileSync(source, 'keep')

    const result = renameFromPayload('{', {
      exists: fileExistsWithCaseSync,
      renameSync,
    })

    assert.equal(result.ok, false)
    assert.equal(existsSync(source), true)
  })
})

it('renames from a valid payload', () => {
  withTempDirectory((directory) => {
    const source = path.join(directory, 'Hello.txt')
    const destination = path.join(directory, 'hello.txt')
    writeFileSync(source, 'keep')

    const result = renameFromPayload(JSON.stringify([
      { before: source, after: destination },
    ]), {
      exists: fileExistsWithCaseSync,
      renameSync,
    })

    assert.equal(result.ok, true)
    assert.equal(existsSync(source), false)
    assert.equal(existsSync(destination), true)
  })
})
