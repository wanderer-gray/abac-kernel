export const Add = '+'

export const Sub = '-'

export const Mult = '*'

export const Div = '/'

export const Mod = '%'

export const FloorDiv = '//'

export type Type = '+' | '-' | '*' | '/' | '%' | '//'

export function is (text: string) : text is Type {
  return !!{
    Add,
    Sub,
    Mult,
    Div,
    Mod,
    FloorDiv
  }[text]
}
