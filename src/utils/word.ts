export const Null = convertToIText('NULL')

export const False = convertToIText('FALSE')

export const True = convertToIText('TRUE')

export const And = convertToIText('AND')

export function convertToIText (text: string) {
  return text.toUpperCase()
}
