export const enum Char {
  Plus = '+',
  Minus = '-',
  Dot = '.',
  Apos = '\'',
  Lpar = '(',
  Rpar = ')',
  Comma = ','
}

export const enum Word {
  Null = 'NULL',
  False = 'FALSE',
  True = 'TRUE',
  And = 'AND'
}

export const enum BinOp {
  Add = '+',
  Sub = '-',
  Mult = '*',
  Div = '/',
  Mod = '%',
  FloorDiv = '//'
}

export const enum CmpOp {
  Eq = '=',
  NotEq = '!=',
  Lt = '<',
  LtE = '<=',
  Gt = '>',
  GtE = '>=',
  In = 'IN',
  Like = 'LIKE',
  Between = 'BETWEEN',
  Is = 'IS'
}

export const enum BoolOp {
  Not = 'NOT',
  And = 'AND',
  Or = 'OR'
}
