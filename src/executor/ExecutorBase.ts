import {
  TSupport,
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject
} from '../Type'
import {
  TAst,
  TAstValue,
  TAstOp,
  TAstOpBool,
  TAstProp,
  assertIsAstValue,
  assertIsAstValueNull,
  assertIsAstValueBoolean,
  assertIsAstValueNumber,
  assertIsAstValueString,
  assertIsAstAttribute,
  assertIsAstFunction,
  assertIsAstOp,
  assertIsAstOpBin,
  assertIsAstOpCmp,
  assertIsAstOpIn,
  assertIsAstOpLike,
  assertIsAstOpBetween,
  assertIsAstOpIs,
  assertIsAstOpBool,
  assertIsAstOpBoolNot,
  assertIsAstOpBoolAnd,
  assertIsAstOpBoolOr,
  assertIsAstProp,
  assertIsAstPropGet,
  assertIsAstPropIndex
} from '../Ast'
import { Namespace } from '../Namespace'
import { Context } from '../Context'

class ExecutorBase {
  protected readonly ast: TAst
  protected readonly namespace: Namespace
  protected readonly context: Context

  constructor (ast: TAst, namespace: Namespace, context: Context) {
    this.ast = ast
    this.namespace = namespace
    this.context = context
  }

  protected error (message: string): never {
    throw new Error(`Executor: ${message}`)
  }

  private getAstValueNull = (astValue: TAstValue) => {
    assertIsAstValueNull(astValue)

    return null
  }

  private getAstValueBoolean = (astValue: TAstValue) => {
    return assertIsAstValueBoolean(astValue).value
  }

  private getAstValueNumber = (astValue: TAstValue) => {
    return assertIsAstValueNumber(astValue).value
  }

  private getAstValueString = (astValue: TAstValue) => {
    return assertIsAstValueString(astValue).value
  }

  private getAstValue = (ast: TAst) => {
    const astValue = assertIsAstValue(ast)

    return {
      null: this.getAstValueNull,
      boolean: this.getAstValueBoolean,
      number: this.getAstValueNumber,
      string: this.getAstValueString
    }[astValue.type]?.(astValue)
  }

  private getAstAttribute = (ast: TAst) => {
    const astAttr = assertIsAstAttribute(ast)

    const attr = this.namespace.getAttribute(astAttr.name)

    return attr.get(this.context)
  }

  private execAstFunction = async (ast: TAst) => {
    const astFunc = assertIsAstFunction(ast)

    const func = this.namespace.getFunction(astFunc.name)

    const args = await Promise.all(astFunc.args.map(this.execute))

    return func.exec(args)
  }

  private execAstPropGet = async (astProp: TAstProp) => {
    const astPropGet = assertIsAstPropGet(astProp)

    const value = await this.execute(astPropGet.value)

    if (!isObject(value)) {
      this.error('Expected value object')
    }

    const { name } = astPropGet

    if (!(name in value)) {
      this.error('Object does not contain a property')
    }

    return value[name]
  }

  private execAstPropIndex = async (astProp: TAstProp) => {
    const astPropIndex = assertIsAstPropIndex(astProp)

    const value = await this.execute(astPropIndex.value)

    if (!isArray(value)) {
      this.error('Expected value array')
    }

    const { index } = astPropIndex

    if (index < 0 || index >= value.length) {
      this.error('index out of range')
    }

    return value[index]
  }

  private execAstProp = (ast: TAst) => {
    const astProp = assertIsAstProp(ast)

    return {
      get: this.execAstPropGet,
      index: this.execAstPropIndex
    }[astProp.type](astProp)
  }

  private execAstOpBinAdd = async (astLeft: TAst, astRight: TAst) => {
    const left = await this.execute(astLeft)

    if (!isString(left) && !isNumber(left)) {
      this.error('Expected left string or number')
    }

    const right = await this.execute(astRight)

    if (isString(left) && isString(right)) {
      return left + right
    }

    if (isNumber(left) && isNumber(right)) {
      return left + right
    }

    this.error('Pair of strings or numbers expected')
  }

  private execAstOpBinSub = async (astLeft: TAst, astRight: TAst) => {
    const left = await this.execute(astLeft)

    if (!isNumber(left)) {
      this.error('Expected left number')
    }

    const right = await this.execute(astRight)

    if (!isNumber(right)) {
      this.error('Expected right number')
    }

    return left - right
  }

  private execAstOpBinMult = async (astLeft: TAst, astRight: TAst) => {
    const left = await this.execute(astLeft)

    if (!isNumber(left)) {
      this.error('Expected left number')
    }

    if (!left) {
      return 0
    }

    const right = await this.execute(astRight)

    if (!isNumber(right)) {
      this.error('Expected right number')
    }

    return left * right
  }

  private execAstOpBinDiv = async (astLeft: TAst, astRight: TAst) => {
    const right = await this.execute(astRight)

    if (!isNumber(right)) {
      this.error('Expected right number')
    }

    if (!right) {
      this.error('Division by zero is not allowed')
    }

    const left = await this.execute(astLeft)

    if (!isNumber(left)) {
      this.error('Expected left number')
    }

    return left / right
  }

  private execAstOpBinMod = async (astLeft: TAst, astRight: TAst) => {
    const right = await this.execute(astRight)

    if (!isNumber(right)) {
      this.error('Expected right number')
    }

    if (!right) {
      this.error('Division by zero is not allowed')
    }

    const left = await this.execute(astLeft)

    if (!isNumber(left)) {
      this.error('Expected left number')
    }

    return left % right
  }

  private execAstOpBinFloorDiv = async (astLeft: TAst, astRight: TAst) => {
    const quotient = await this.execAstOpBinDiv(astLeft, astRight)

    return Math.floor(quotient)
  }

  private execAstOpBin = async (astOp: TAstOp) => {
    const astOpBin = assertIsAstOpBin(astOp)

    return {
      '+': this.execAstOpBinAdd,
      '-': this.execAstOpBinSub,
      '*': this.execAstOpBinMult,
      '/': this.execAstOpBinDiv,
      '%': this.execAstOpBinMod,
      '//': this.execAstOpBinFloorDiv
    }[astOpBin.op](astOpBin.left, astOpBin.right)
  }

  private Eq = (left: TSupport, right: TSupport): boolean => {
    if (left === right) {
      return true
    }

    if (isArray(left) && isArray(right)) {
      if (left.length !== right.length) {
        return false
      }

      return left.every((leftItem, index) => {
        const rightItem = right[index]

        return this.Eq(leftItem, rightItem)
      })
    }

    if (isObject(left) && isObject(right)) {
      if (Object.keys(left).length !== Object.keys(right).length) {
        return false
      }

      return Object.entries(left).every(([field, leftField]) => {
        const rightField = right[field]

        return this.Eq(leftField, rightField)
      })
    }

    return false
  }

  private NotEq = (left: TSupport, right: TSupport) => {
    return !this.Eq(left, right)
  }

  private Lt = (left: TSupport, right: TSupport) => {
    if (!isNumber(left) || !isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left < right
  }

  private LtE = (left: TSupport, right: TSupport) => {
    if (!isNumber(left) || !isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left <= right
  }

  private Gt = (left: TSupport, right: TSupport) => {
    if (!isNumber(left) || !isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left > right
  }

  private GtE = (left: TSupport, right: TSupport) => {
    if (!isNumber(left) || !isNumber(right)) {
      this.error('Pair of numbers expected')
    }

    return left >= right
  }

  private execAstOpCmp = async (astOp: TAstOp) => {
    const astOpCmp = assertIsAstOpCmp(astOp)

    const [
      left,
      right
    ] = await Promise.all([
      this.execute(astOpCmp.left),
      this.execute(astOpCmp.right)
    ])

    return {
      '==': this.Eq,
      '!=': this.NotEq,
      '<': this.Lt,
      '<=': this.LtE,
      '>': this.Gt,
      '>=': this.GtE
    }[astOpCmp.op](left, right)
  }

  private execAstOpIn = async (astOp: TAstOp) => {
    const astOpIn = assertIsAstOpIn(astOp)

    const value = await this.execute(astOpIn.value)

    for (const item of astOpIn.set) {
      const arg = await this.execute(item)

      if (this.Eq(value, arg)) {
        return true
      }
    }

    return false
  }

  private execAstOpLike = async (astOp: TAstOp) => {
    const astOpLike = assertIsAstOpLike(astOp)

    const value = await this.execute(astOpLike.value)

    if (!isString(value)) {
      this.error('Expected value string')
    }

    const pattern = await this.execute(astOpLike.pattern)

    if (!isString(pattern)) {
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

  private execAstOpBetween = async (astOp: TAstOp) => {
    const astOpBetween = assertIsAstOpBetween(astOp)

    const value = await this.execute(astOpBetween.value)

    if (!isNumber(value)) {
      this.error('Expected value number')
    }

    const begin = await this.execute(astOpBetween.begin)

    if (!isNumber(begin)) {
      this.error('Expected begin number')
    }

    if (value < begin) {
      return false
    }

    const end = await this.execute(astOpBetween.end)

    if (!isNumber(end)) {
      this.error('Expected end number')
    }

    return value <= end
  }

  private execAstOpIs = async (astOp: TAstOp) => {
    const astOpIs = assertIsAstOpIs(astOp)

    const value = await this.execute(astOpIs.value)

    return isNull(value)
  }

  private execAstOpBoolNot = async (astOpBool: TAstOpBool) => {
    const astOpBoolNot = assertIsAstOpBoolNot(astOpBool)

    const value = await this.execute(astOpBoolNot.value)

    if (!isBoolean(value)) {
      this.error('Expected value boolean')
    }

    return !value
  }

  private execAstOpBoolAnd = async (astOpBool: TAstOpBool) => {
    const astOpBoolAnd = assertIsAstOpBoolAnd(astOpBool)

    const left = await this.execute(astOpBoolAnd.left)

    if (!isBoolean(left)) {
      this.error('Expected left boolean')
    }

    if (!left) {
      return false
    }

    const right = await this.execute(astOpBoolAnd.right)

    if (!isBoolean(right)) {
      this.error('Expected right boolean')
    }

    return right
  }

  private execAstOpBoolOr = async (astOpBool: TAstOpBool) => {
    const astOpBoolOr = assertIsAstOpBoolOr(astOpBool)

    const left = await this.execute(astOpBoolOr.left)

    if (!isBoolean(left)) {
      this.error('Expected left boolean')
    }

    if (left) {
      return true
    }

    const right = await this.execute(astOpBoolOr.right)

    if (!isBoolean(right)) {
      this.error('Expected right boolean')
    }

    return right
  }

  private execAstOpBool = async (astOp: TAstOp) => {
    const astOpBool = assertIsAstOpBool(astOp)

    return {
      not: this.execAstOpBoolNot,
      and: this.execAstOpBoolAnd,
      or: this.execAstOpBoolOr
    }[astOpBool.op](astOpBool)
  }

  private execAstOp = (ast: TAst) => {
    const astOp = assertIsAstOp(ast)

    return {
      bin: this.execAstOpBin,
      cmp: this.execAstOpCmp,
      in: this.execAstOpIn,
      like: this.execAstOpLike,
      between: this.execAstOpBetween,
      is: this.execAstOpIs,
      bool: this.execAstOpBool
    }[astOp.type](astOp)
  }

  protected execute (ast: TAst): TSupport | Promise<TSupport> {
    return {
      value: this.getAstValue,
      attribute: this.getAstAttribute,
      function: this.execAstFunction,
      prop: this.execAstProp,
      op: this.execAstOp
    }[ast.class](ast)
  }
}

export {
  ExecutorBase
}
