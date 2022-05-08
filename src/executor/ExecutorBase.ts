import { type } from '../utils'
import { Context } from '../Context'

export class ExecutorBase {
  protected readonly ast: type.TAst
  protected readonly context: Context

  constructor (ast: type.TAst, context: Context) {
    this.ast = ast
    this.context = context
  }

  protected error (message: string) : never {
    throw new Error(`Executor: ${message}`)
  }

  private getNull = (ast: type.TAst) => {
    if (ast.type !== 'null') {
      this.error('Expected type null')
    }

    return null
  }

  private getBool = (ast: type.TAst) => {
    if (ast.type !== 'bool') {
      this.error('Expected type bool')
    }

    return ast.value
  }

  private getNum = (ast: type.TAst) => {
    if (ast.type !== 'num') {
      this.error('Expected type num')
    }

    return ast.value
  }

  private getStr = (ast: type.TAst) => {
    if (ast.type !== 'str') {
      this.error('Expected type str')
    }

    return ast.value
  }

  private getAttr = (ast: type.TAst) => {
    if (ast.type !== 'attr') {
      this.error('Expected type attr')
    }

    return this.context.getAttribute(ast.name).get(this.context)
  }

  private execFunc = async (ast: type.TAst) => {
    if (ast.type !== 'func') {
      this.error('Expected type func')
    }

    const func = this.context.getFunction(ast.name)

    const args = await Promise.all(ast.args.map((arg) => this.execute(arg)))

    return func.exec(args)
  }

  private execBinOpAdd = (left: type.TSupport, right: type.TSupport) => {
    if (type.isString(left) && type.isString(right)) {
      return left + right
    }

    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of strings or numbers expected')
    }

    return left + right
  }

  private execBinOpSub = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left - right
  }

  private execBinOpMult = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left * right
  }

  private execBinOpDiv = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    if (!right) {
      this.error('Division by zero is not allowed')
    }

    return left / right
  }

  private execBinOpMod = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    if (!right) {
      this.error('Division by zero is not allowed')
    }

    return left % right
  }

  private execBinOpFloorDiv = (left: type.TSupport, right: type.TSupport) => {
    return Math.floor(this.execBinOpDiv(left, right))
  }

  private execBinOp = async (ast: type.TAst) => {
    if (ast.type !== 'binOp') {
      this.error('Expected type binOp')
    }

    const [
      left,
      right
    ] = await Promise.all([
      this.execute(ast.left),
      this.execute(ast.right)
    ])

    return {
      '+': this.execBinOpAdd,
      '-': this.execBinOpSub,
      '*': this.execBinOpMult,
      '/': this.execBinOpDiv,
      '%': this.execBinOpMod,
      '//': this.execBinOpFloorDiv
    }[ast.op](left, right)
  }

  private execCmpOpEq = (left: type.TSupport, right: type.TSupport) : boolean => {
    if (left === right) {
      return true
    }

    if (type.isArray(left) && type.isArray(right)) {
      if (left.length !== right.length) {
        return false
      }

      return left.every((leftItem, index) => {
        const rightItem = right[index]

        return this.execCmpOpEq(leftItem, rightItem)
      })
    }

    if (type.isObject(left) && type.isObject(right)) {
      if (Object.keys(left).length !== Object.keys(right).length) {
        return false
      }

      return Object.entries(left).every(([field, leftField]) => {
        const rightField = right[field]

        return this.execCmpOpEq(leftField, rightField)
      })
    }

    return false
  }

  private execCmpOpNotEq = (left: type.TSupport, right: type.TSupport) => {
    return !this.execCmpOpEq(left, right)
  }

  private execCmpOpLt = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left < right
  }

  private execCmpOpLtE = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left <= right
  }

  private execCmpOpGt = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left > right
  }

  private execCmpOpGtE = (left: type.TSupport, right: type.TSupport) => {
    if (!type.isNumber(left) || !type.isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left >= right
  }

  private execCmpOpSimple = async (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.class !== 'simple') {
      this.error('Expected class simple')
    }

    const [
      left,
      right
    ] = await Promise.all([
      this.execute(ast.left),
      this.execute(ast.right)
    ])

    return {
      '=': this.execCmpOpEq,
      '!=': this.execCmpOpNotEq,
      '<': this.execCmpOpLt,
      '<=': this.execCmpOpLtE,
      '>': this.execCmpOpGt,
      '>=': this.execCmpOpGtE
    }[ast.op](left, right)
  }

  private execCmpOpIn = async (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.op !== 'in') {
      this.error('Expected type in')
    }

    const value = await this.execute(ast.value)

    for (const item of ast.set) {
      const arg = await this.execute(item)

      if (this.execCmpOpEq(value, arg)) {
        return true
      }
    }

    return false
  }

  private execCmpOpLike = async (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.op !== 'like') {
      this.error('Expected type like')
    }

    const value = await this.execute(ast.value)

    if (!type.isString(value)) {
      this.error('Expected value string')
    }

    const pattern = await this.execute(ast.pattern)

    if (!type.isString(pattern)) {
      this.error('Expected pattern string')
    }

    function escape (text: string) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    function replace (text: string) {
      return text.replace(/[_%]/g, (char) => {
        return {
          _: '.',
          '%': '.*'
        }[char] ?? ''
      })
    }

    function bind (text: string) {
      return `^${text}$`
    }

    return new RegExp(bind(replace(escape(pattern)))).test(value)
  }

  private execCmpOpBetween = async (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.op !== 'between') {
      this.error('Expected type between')
    }

    const value = await this.execute(ast.value)

    if (!type.isNumber(value)) {
      this.error('Expected value number')
    }

    const begin = await this.execute(ast.begin)

    if (!type.isNumber(begin)) {
      this.error('Expected begin number')
    }

    if (value < begin) {
      return false
    }

    const end = await this.execute(ast.end)

    if (!type.isNumber(end)) {
      this.error('Expected end number')
    }

    return value <= end
  }

  private execCmpOpIs = async (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.op !== 'is') {
      this.error('Expected type is')
    }

    const value = await this.execute(ast.value)

    return type.isNull(value)
  }

  private execCmpOpComplex = (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    if (ast.class !== 'complex') {
      this.error('Expected class complex')
    }

    return {
      in: this.execCmpOpIn,
      like: this.execCmpOpLike,
      between: this.execCmpOpBetween,
      is: this.execCmpOpIs
    }[ast.op](ast)
  }

  private execCmpOp = (ast: type.TAst) => {
    if (ast.type !== 'cmpOp') {
      this.error('Expected type cmpOp')
    }

    return {
      simple: this.execCmpOpSimple,
      complex: this.execCmpOpComplex
    }[ast.class](ast)
  }

  private execBoolOpNot = async (ast: type.TAst) => {
    if (ast.type !== 'boolOp') {
      this.error('Expected type boolOp')
    }

    if (ast.op !== 'not') {
      this.error('Expected op not')
    }

    const value = await this.execute(ast.value)

    if (!type.isBoolean(value)) {
      this.error('Expected value boolean')
    }

    return !value
  }

  private execBoolOpAnd = async (ast: type.TAst) => {
    if (ast.type !== 'boolOp') {
      this.error('Expected type boolOp')
    }

    if (ast.op !== 'and') {
      this.error('Expected op and')
    }

    const left = await this.execute(ast.left)

    if (!type.isBoolean(left)) {
      this.error('Expected left boolean')
    }

    if (!left) {
      return false
    }

    const right = await this.execute(ast.right)

    if (!type.isBoolean(right)) {
      this.error('Expected right boolean')
    }

    return right
  }

  private execBoolOpOr = async (ast: type.TAst) => {
    if (ast.type !== 'boolOp') {
      this.error('Expected type boolOp')
    }

    if (ast.op !== 'or') {
      this.error('Expected op or')
    }

    const left = await this.execute(ast.left)

    if (!type.isBoolean(left)) {
      this.error('Expected left boolean')
    }

    if (left) {
      return true
    }

    const right = await this.execute(ast.right)

    if (!type.isBoolean(right)) {
      this.error('Expected right boolean')
    }

    return right
  }

  private execBoolOp = (ast: type.TAst) => {
    if (ast.type !== 'boolOp') {
      this.error('Expected type boolOp')
    }

    return {
      not: this.execBoolOpNot,
      and: this.execBoolOpAnd,
      or: this.execBoolOpOr
    }[ast.op](ast)
  }

  protected execute (ast: type.TAst) : type.TSupport | Promise<type.TSupport> {
    return {
      null: this.getNull,
      bool: this.getBool,
      num: this.getNum,
      str: this.getStr,
      attr: this.getAttr,
      func: this.execFunc,
      binOp: this.execBinOp,
      cmpOp: this.execCmpOp,
      boolOp: this.execBoolOp
    }[ast.type](ast)
  }
}
