import { word } from '.'

export const Eq = '='

export const NotEq = '!='

export const LtE = '<='

export const Lt = '<'

export const GtE = '>='

export const Gt = '>'

export const In = word.convertToIText('IN')

export const Like = word.convertToIText('LIKE')

export const Between = word.convertToIText('BETWEEN')

export const Is = word.convertToIText('IS')

export type TypeSimple = '=' | '!=' | '<' | '<=' | '>' | '>='

export function isSimple (text: string) : text is TypeSimple {
  return !!{
    Eq,
    NotEq,
    Lt,
    LtE,
    Gt,
    GtE
  }[text]
}
