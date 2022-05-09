export const NULL = convertToIText('null')

export const FALSE = convertToIText('false')

export const TRUE = convertToIText('true')

export const AND = convertToIText('and')

export function convertToIText (text: string) {
  return text.toUpperCase()
}
