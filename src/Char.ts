function isDigit (char: string) {
  return /^[0-9]$/.test(char)
}

function isLetter (char: string) {
  return /^[a-zA-Z_]$/.test(char)
}

function isLetterOrDigit (char: string) {
  return isLetter(char) || isDigit(char)
}

function isWhitespace (char: string) {
  return /^[\s\uFEFF\xA0]$/.test(char)
}

export {
  isDigit,
  isLetter,
  isLetterOrDigit,
  isWhitespace
}
