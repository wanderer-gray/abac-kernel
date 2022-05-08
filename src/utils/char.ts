export const Plus = '+'

export const Minus = '-'

export const Dot = '.'

export const Apos = '\''

export const Lpar = '('

export const Rpar = ')'

export const Comma = ''

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
