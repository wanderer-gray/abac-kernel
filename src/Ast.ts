import { isObject } from './Type'

type TAst = {
  class: 'value' | 'attribute' | 'function' | 'op',
  type: string
}

type TAstValue = TAst & {
  class: 'value',
  type: 'null' | 'boolean' | 'number' | 'string'
}

type TAstValueNull = TAstValue & { type: 'null' }

type TAstValueBoolean = TAstValue & {
  type: 'boolean',
  value: boolean
}

type TAstValueNumber = TAstValue & {
  type: 'number',
  value: number
}

type TAstValueString = TAstValue & {
  type: 'string',
  value: string
}

type TAstAttribute = TAst & {
  class: 'attribute',
  name: string
}

type TAstFunction = TAst & {
  class: 'function',
  name: string,
  args: TAst[]
}

type TAstOp = TAst & {
  class: 'op',
  type: 'bin' | 'cmp' | 'in' | 'like' | 'between' | 'is' | 'bool'
}

type TAstOpBin = TAstOp & {
  type: 'bin',
  op: '+' | '-' | '*' | '/' | '%' | '//',
  left: TAst,
  right: TAst
}

type TAstOpBinAdd = TAstOpBin & { op: '+' }

type TAstOpBinSub = TAstOpBin & { op: '-' }

type TAstOpBinMult = TAstOpBin & { op: '*' }

type TAstOpBinDiv = TAstOpBin & { op: '/' }

type TAstOpBinMod = TAstOpBin & { op: '%' }

type TAstOpBinFloorDiv = TAstOpBin & { op: '//' }

type TAstOpCmp = TAstOp & {
  type: 'cmp',
  op: '=' | '!=' | '<' | '<=' | '>' | '>=',
  left: TAst,
  right: TAst
}

type TAstOpCmpEq = TAstOpCmp & { op: '=' }

type TAstOpCmpNotEq = TAstOpCmp & { op: '!=' }

type TAstOpCmpLt = TAstOpCmp & { op: '<' }

type TAstOpCmpLtE = TAstOpCmp & { op: '<=' }

type TAstOpCmpGt = TAstOpCmp & { op: '>' }

type TAstOpCmpGtE = TAstOpCmp & { op: '>=' }

type TAstOpIn = TAstOp & {
  type: 'in',
  value: TAst,
  set: TAst[]
}

type TAstOpLike = TAstOp & {
  type: 'like',
  value: TAst,
  pattern: TAst
}

type TAstOpBetween = TAstOp & {
  type: 'between',
  value: TAst,
  begin: TAst,
  end: TAst
}

type TAstOpIs = TAstOp & {
  type: 'is',
  value: TAst
}

type TAstOpBool = TAstOp & {
  type: 'bool',
  op: 'not' | 'and' | 'or'
}

type TAstOpBoolNot = TAstOpBool & {
  op: 'not',
  value: TAst
}

type TAstOpBoolAnd = TAstOpBool & {
  op: 'and',
  left: TAst,
  right: TAst
}

type TAstOpBoolOr = TAstOpBool & {
  op: 'or',
  left: TAst,
  right: TAst
}

function isAst (ast: any): ast is TAst {
  return isObject(ast)
}

function isAstValue (ast: TAst): ast is TAstValue {
  return ast.class === 'value'
}

function isAstValueNull (ast: TAstValue): ast is TAstValueNull {
  return ast.type === 'null'
}

function isAstValueBoolean (ast: TAstValue): ast is TAstValueBoolean {
  return ast.type === 'boolean'
}

function isAstValueNumber (ast: TAstValue): ast is TAstValueNumber {
  return ast.type === 'number'
}

function isAstValueString (ast: TAstValue): ast is TAstValueString {
  return ast.type === 'string'
}

function isAstAttribute (ast: TAst): ast is TAstAttribute {
  return ast.class === 'attribute'
}

function isAstFunction (ast: TAst): ast is TAstFunction {
  return ast.class === 'function'
}

function isAstOp (ast: TAst): ast is TAstOp {
  return ast.class === 'op'
}

function isAstOpBin (ast: TAstOp): ast is TAstOpBin {
  return ast.type === 'bin'
}

function isAstOpBinAdd (ast: TAstOpBin): ast is TAstOpBinAdd {
  return ast.op === '+'
}

function isAstOpBinSub (ast: TAstOpBin): ast is TAstOpBinSub {
  return ast.op === '-'
}

function isAstOpBinMult (ast: TAstOpBin): ast is TAstOpBinMult {
  return ast.op === '*'
}

function isAstOpBinDiv (ast: TAstOpBin): ast is TAstOpBinDiv {
  return ast.op === '/'
}

function isAstOpBinMod (ast: TAstOpBin): ast is TAstOpBinMod {
  return ast.op === '%'
}

function isAstOpBinFloorDiv (ast: TAstOpBin): ast is TAstOpBinFloorDiv {
  return ast.op === '//'
}

function isAstOpCmp (ast: TAstOp): ast is TAstOpCmp {
  return ast.type === 'cmp'
}

function isAstOpCmpEq (ast: TAstOpCmp): ast is TAstOpCmpEq {
  return ast.op === '='
}

function isAstOpCmpNotEq (ast: TAstOpCmp): ast is TAstOpCmpNotEq {
  return ast.op === '!='
}

function isAstOpCmpLt (ast: TAstOpCmp): ast is TAstOpCmpLt {
  return ast.op === '<'
}

function isAstOpCmpLtE (ast: TAstOpCmp): ast is TAstOpCmpLtE {
  return ast.op === '<='
}

function isAstOpCmpGt (ast: TAstOpCmp): ast is TAstOpCmpGt {
  return ast.op === '>'
}

function isAstOpCmpGtE (ast: TAstOpCmp): ast is TAstOpCmpGtE {
  return ast.op === '>='
}

function isAstOpIn (ast: TAstOp): ast is TAstOpIn {
  return ast.type === 'in'
}

function isAstOpLike (ast: TAstOp): ast is TAstOpLike {
  return ast.type === 'like'
}

function isAstOpBetween (ast: TAstOp): ast is TAstOpBetween {
  return ast.type === 'between'
}

function isAstOpIs (ast: TAstOp): ast is TAstOpIs {
  return ast.type === 'is'
}

function isAstOpBool (ast: TAstOp): ast is TAstOpBool {
  return ast.type === 'bool'
}

function isAstOpBoolNot (ast: TAstOpBool): ast is TAstOpBoolNot {
  return ast.op === 'not'
}

function isAstOpBoolAnd (ast: TAstOpBool): ast is TAstOpBoolAnd {
  return ast.op === 'and'
}

function isAstOpBoolOr (ast: TAstOpBool): ast is TAstOpBoolOr {
  return ast.op === 'or'
}

function error (message: string): never {
  throw new Error(message)
}

function assertIsAst (ast: any, message: string = 'Is not a Ast') {
  if (!isAst(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstValue (ast: TAst, message: string = 'Is not a AstValue') {
  if (!isAstValue(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstValueNull (ast: TAstValue, message: string = 'Is not a AstValueNull') {
  if (!isAstValueNull(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstValueBoolean (ast: TAstValue, message: string = 'Is not a AstValueBoolean') {
  if (!isAstValueBoolean(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstValueNumber (ast: TAstValue, message: string = 'Is not a AstValueNumber') {
  if (!isAstValueNumber(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstValueString (ast: TAstValue, message: string = 'Is not a AstValueString') {
  if (!isAstValueString(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstAttribute (ast: TAst, message: string = 'Is not a AstAttribute') {
  if (!isAstAttribute(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstFunction (ast: TAst, message: string = 'Is not a AstFunction') {
  if (!isAstFunction(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOp (ast: TAst, message: string = 'Is not a AstOp') {
  if (!isAstOp(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBin (ast: TAstOp, message: string = 'Is not a AstOpBin') {
  if (!isAstOpBin(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinAdd (ast: TAstOpBin, message: string = 'Is not a AstOpBinAdd') {
  if (!isAstOpBinAdd(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinSub (ast: TAstOpBin, message: string = 'Is not a AstOpBinSub') {
  if (!isAstOpBinSub(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinMult (ast: TAstOpBin, message: string = 'Is not a AstOpBinMult') {
  if (!isAstOpBinMult(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinDiv (ast: TAstOpBin, message: string = 'Is not a AstOpBinDiv') {
  if (!isAstOpBinDiv(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinMod (ast: TAstOpBin, message: string = 'Is not a AstOpBinMod') {
  if (!isAstOpBinMod(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBinFloorDiv (ast: TAstOpBin, message: string = 'Is not a AstOpBinFloorDiv') {
  if (!isAstOpBinFloorDiv(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmp (ast: TAstOp, message: string = 'Is not a AstOpCmp') {
  if (!isAstOpCmp(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpEq (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpEq') {
  if (!isAstOpCmpEq(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpNotEq (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpNotEq') {
  if (!isAstOpCmpNotEq(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpLt (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpLt') {
  if (!isAstOpCmpLt(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpLtE (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpLtE') {
  if (!isAstOpCmpLtE(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpGt (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpGt') {
  if (!isAstOpCmpGt(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpCmpGtE (ast: TAstOpCmp, message: string = 'Is not a AstOpCmpGtE') {
  if (!isAstOpCmpGtE(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpIn (ast: TAstOp, message: string = 'Is not a AstOpIn') {
  if (!isAstOpIn(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpLike (ast: TAstOp, message: string = 'Is not a AstOpLike') {
  if (!isAstOpLike(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBetween (ast: TAstOp, message: string = 'Is not a AstOpBetween') {
  if (!isAstOpBetween(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpIs (ast: TAstOp, message: string = 'Is not a AstOpIs') {
  if (!isAstOpIs(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBool (ast: TAstOp, message: string = 'Is not a AstOpBool') {
  if (!isAstOpBool(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBoolNot (ast: TAstOpBool, message: string = 'Is not a AstOpBoolNot') {
  if (!isAstOpBoolNot(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBoolAnd (ast: TAstOpBool, message: string = 'Is not a AstOpBoolAnd') {
  if (!isAstOpBoolAnd(ast)) {
    error(message)
  }

  return ast
}

function assertIsAstOpBoolOr (ast: TAstOpBool, message: string = 'Is not a AstOpBoolOr') {
  if (!isAstOpBoolOr(ast)) {
    error(message)
  }

  return ast
}

export {
  TAst,
  TAstValue,
  TAstValueNull,
  TAstValueBoolean,
  TAstValueNumber,
  TAstValueString,
  TAstAttribute,
  TAstFunction,
  TAstOp,
  TAstOpBin,
  TAstOpBinAdd,
  TAstOpBinSub,
  TAstOpBinMult,
  TAstOpBinDiv,
  TAstOpBinMod,
  TAstOpBinFloorDiv,
  TAstOpCmp,
  TAstOpCmpEq,
  TAstOpCmpNotEq,
  TAstOpCmpLt,
  TAstOpCmpLtE,
  TAstOpCmpGt,
  TAstOpCmpGtE,
  TAstOpIn,
  TAstOpLike,
  TAstOpBetween,
  TAstOpIs,
  TAstOpBool,
  TAstOpBoolNot,
  TAstOpBoolAnd,
  TAstOpBoolOr,
  isAst,
  isAstValue,
  isAstValueNull,
  isAstValueBoolean,
  isAstValueNumber,
  isAstValueString,
  isAstAttribute,
  isAstFunction,
  isAstOp,
  isAstOpBin,
  isAstOpBinAdd,
  isAstOpBinSub,
  isAstOpBinMult,
  isAstOpBinDiv,
  isAstOpBinMod,
  isAstOpBinFloorDiv,
  isAstOpCmp,
  isAstOpCmpEq,
  isAstOpCmpNotEq,
  isAstOpCmpLt,
  isAstOpCmpLtE,
  isAstOpCmpGt,
  isAstOpCmpGtE,
  isAstOpIn,
  isAstOpLike,
  isAstOpBetween,
  isAstOpIs,
  isAstOpBool,
  isAstOpBoolNot,
  isAstOpBoolAnd,
  isAstOpBoolOr,
  assertIsAst,
  assertIsAstValue,
  assertIsAstValueNull,
  assertIsAstValueBoolean,
  assertIsAstValueNumber,
  assertIsAstValueString,
  assertIsAstAttribute,
  assertIsAstFunction,
  assertIsAstOp,
  assertIsAstOpBin,
  assertIsAstOpBinAdd,
  assertIsAstOpBinSub,
  assertIsAstOpBinMult,
  assertIsAstOpBinDiv,
  assertIsAstOpBinMod,
  assertIsAstOpBinFloorDiv,
  assertIsAstOpCmp,
  assertIsAstOpCmpEq,
  assertIsAstOpCmpNotEq,
  assertIsAstOpCmpLt,
  assertIsAstOpCmpLtE,
  assertIsAstOpCmpGt,
  assertIsAstOpCmpGtE,
  assertIsAstOpIn,
  assertIsAstOpLike,
  assertIsAstOpBetween,
  assertIsAstOpIs,
  assertIsAstOpBool,
  assertIsAstOpBoolNot,
  assertIsAstOpBoolAnd,
  assertIsAstOpBoolOr
}
