const Char = {
  Plus: '+',
  Minus: '-',
  Dot: '.',
  Apos: '\'',
  Lpar: '(',
  Rpar: ')',
  Comma: ','
}

export function isDigit (char: string) {
  return /^[0-9]$/.test(char)
}

export function isLetter (char: string) {
  return /^[a-zA-Z_]$/.test(char)
}

export function isLetterOrDigit (char: string) {
  return isLetter(char) || isDigit(char)
}

export function isWhitespace (char: string) {
  return /^[\s\uFEFF\xA0]$/.test(char)
}
