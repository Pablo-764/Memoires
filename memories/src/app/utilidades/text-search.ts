// Compara sin importar mayúsculas ni acentos, conservando la longitud del texto
export function fold(text: string) {
  return text
    .split('')
    .map((c) => c.normalize('NFD').charAt(0).toLowerCase())
    .join('')
}

export function matches(text: string, query: string) {
  return fold(text).includes(fold(query.trim()))
}

export function highlight(text: string, query: string) {
  const q = fold(query.trim())
  if (!q) return [{ text, hit: false }]
  const haystack = fold(text)
  const parts: { text: string; hit: boolean }[] = []
  let from = 0
  for (let at = haystack.indexOf(q); at !== -1; at = haystack.indexOf(q, from)) {
    if (at > from) parts.push({ text: text.slice(from, at), hit: false })
    parts.push({ text: text.slice(at, at + q.length), hit: true })
    from = at + q.length
  }
  if (from < text.length) parts.push({ text: text.slice(from), hit: false })
  return parts
}
