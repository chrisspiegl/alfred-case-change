export function parseRenamePayload(raw) {
  let parsed
  try {
    parsed = JSON.parse(raw)
  }
  catch {
    return { ok: false, items: [] }
  }

  if (!Array.isArray(parsed))
    return { ok: false, items: [] }

  return { ok: true, items: parsed }
}

export function renameFromPayload(raw, { exists, renameSync }) {
  const parsed = parseRenamePayload(raw)
  if (!parsed.ok)
    return parsed

  for (const element of parsed.items) {
    if (
      exists(element.before)
      && !exists(element.after)
    ) {
      renameSync(element.before, element.after)
    }
  }

  return parsed
}
