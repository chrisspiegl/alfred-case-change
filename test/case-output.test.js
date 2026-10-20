import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
// node:test is the runner. The default config would rewrite this import to vitest.
// eslint-disable-next-line test/no-import-node-test
import { it } from 'node:test'
import { buildCaseItems } from '../src/case-output.js'

function withTempDirectory(run) {
  const directory = mkdtempSync(path.join(tmpdir(), 'case-change-'))
  try {
    return run(directory)
  }
  finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

it('joins copy args into one string', () => {
  const items = buildCaseItems(['Hello World', 'Second Line'], undefined)
  const camel = items.find(item => item.match === 'camelCase')
  const param = items.find(item => item.match === 'paramCase')

  assert.equal(typeof camel.arg, 'string')
  assert.equal(Array.isArray(camel.arg), false)
  assert.equal(camel.arg, 'helloWorld\nsecondLine')
  assert.equal(param.arg, 'hello-world\nsecond-line')
})

it('does not append a dot when the file has no extension', () => {
  withTempDirectory((directory) => {
    const filePath = path.join(directory, 'Hello World')
    writeFileSync(filePath, '')

    for (const command of ['name', 'ext', 'both']) {
      const items = buildCaseItems([filePath], command)
      const lower = items.find(item => item.match === 'lowerCase')
      const baseName = path.basename(lower.arg)
      assert.equal(baseName.endsWith('.'), false, command)
      assert.equal(baseName, command === 'ext' ? 'Hello World' : 'hello world')
    }
  })
})

it('does not append a dot to a dotfile', () => {
  withTempDirectory((directory) => {
    const filePath = path.join(directory, '.gitignore')
    writeFileSync(filePath, '')
    const items = buildCaseItems([filePath], 'both')
    const lower = items.find(item => item.match === 'lowerCase')
    assert.equal(path.basename(lower.arg), '.gitignore')
  })
})

it('keeps the dot when the file has an extension', () => {
  withTempDirectory((directory) => {
    const first = path.join(directory, 'Hello World.TXT')
    const second = path.join(directory, 'Another File.TXT')
    writeFileSync(first, '')
    writeFileSync(second, '')

    const items = buildCaseItems([first, second], 'name')
    const lower = items.find(item => item.match === 'lowerCase')
    assert.equal(lower.arg, [
      path.join(directory, 'hello world.TXT'),
      path.join(directory, 'another file.TXT'),
    ].join('\n'))

    const renamed = JSON.parse(lower.mods.cmd.arg)
    assert.equal(Array.isArray(renamed), true)
    assert.equal(renamed[0].after, path.join(directory, 'hello world.TXT'))
  })
})

it('skips a missing path instead of throwing from lstat', () => {
  withTempDirectory((directory) => {
    const existing = path.join(directory, 'Hello World.TXT')
    writeFileSync(existing, '')
    const missing = path.join(directory, 'missing.TXT')

    const items = buildCaseItems([existing, missing], 'name')
    const lower = items.find(item => item.match === 'lowerCase')
    assert.equal(lower.arg, path.join(directory, 'hello world.TXT'))
    assert.equal(lower.arg.includes('missing'), false)
  })
})
