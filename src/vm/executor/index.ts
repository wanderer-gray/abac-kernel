import { AstType, AstNode, AstNodeValue, AstNodeAttr, AstNodeFunc, AstNodeBinOp, AstNodeCmpOp, AstNodeBoolOp } from '../AstNode'
import { BinOp, CmpOp, BoolOp } from '../common'
import { Context } from '../../Context'
import { SuppType } from '../../common'

const equal = (left: SuppType, right: SuppType) => {
  return left === right
}

export class Executor {
  private readonly ast: AstNode
  private readonly context: Context

  constructor (ast: AstNode, context: Context) {
    this.ast = ast
    this.context = context
  }

  private error (message: string) : never {
    throw new Error(message)
  }

  private executeAttr (ast: AstNodeAttr) {
    return this.context.getAttr(ast.name)
  }

  private async executeFunc (ast: AstNodeFunc) {
    const args = await Promise.all(ast.args.map(this.execute))

    return this.context.abac.getFunc(ast.name).exec(args)
  }

  private async executeBinOp (ast: AstNodeBinOp) {
    const [left, right] = await Promise.all(ast.childs.map(this.execute))

    if (typeof left === 'string' && typeof right === 'string') {
      if (ast.op === BinOp.Add) {
        return left + right
      }

      this.error('Unsupported op')
    }

    if (typeof left !== 'number' || typeof right !== 'number') {
      this.error('Unsupported type')
    }

    if (ast.op === BinOp.Add) return left + right
    if (ast.op === BinOp.Sub) return left - right
    if (ast.op === BinOp.Mult) return left * right

    if (!right) {
      this.error('Zero divide')
    }

    if (ast.op === BinOp.Div) return left / right
    if (ast.op === BinOp.Mod) return left % right
    if (ast.op === BinOp.FloorDiv) return Math.floor(left / right)

    this.error('Unsupported op')
  }

  private async executeCmpOp (ast: AstNodeCmpOp) {
    if (ast.op === CmpOp.In) {
      const [rawRoot, ...rawItems] = ast.childs

      const root = await this.execute(rawRoot)

      for (const rawItem of rawItems) {
        const item = await this.execute(rawItem)

        if (equal(root, item)) {
          return true
        }
      }

      return false
    }

    if (ast.op === CmpOp.Like) {
      const [root, pattern] = await Promise.all(ast.childs.map((this.execute)))

      if (typeof root !== 'string' || typeof pattern !== 'string') {
        this.error('Expected string')
      }

      throw new Error('Not impl')
    }

    if (ast.op === CmpOp.Between) {
      const [root, start, end] = await Promise.all(ast.childs.map((this.execute)))

      if (typeof root !== 'number' || typeof start !== 'number' || typeof end !== 'number') {
        this.error('Expected number')
      }

      return root >= start && root <= end
    }

    if (ast.op === CmpOp.Is) {
      const root = await this.execute(ast.childs[0])

      return root === null
    }

    const [left, right] = await Promise.all(ast.childs.map((this.execute)))

    if (ast.op === CmpOp.Eq) return equal(left, right)
    if (ast.op === CmpOp.NotEq) return !equal(left, right)

    if (typeof left !== 'number' || typeof right !== 'number') {
      this.error('Expected number')
    }

    if (ast.op === CmpOp.Lt) return left < right
    if (ast.op === CmpOp.LtE) return left <= right
    if (ast.op === CmpOp.Gt) return left > right
    if (ast.op === CmpOp.GtE) return left >= right

    this.error('Unsupported op')
  }

  private async executeBoolOp (ast: AstNodeBoolOp) {
    const [rawLeft, rawRight] = ast.childs

    const left = await this.execute(rawLeft)

    if (typeof left !== 'boolean') {
      this.error('Expected boolean')
    }

    if (ast.op === BoolOp.Not) return !left
    if (ast.op === BoolOp.And && !left) return false
    if (ast.op === BoolOp.Or && left) return true

    const right = await this.execute(rawRight)

    if (typeof right !== 'boolean') {
      this.error('Expected boolean')
    }

    if (ast.op === BoolOp.And || ast.op === BoolOp.Or) {
      return right
    }

    this.error('Unsupported op')
  }

  private execute = async (ast: AstNode) : Promise<SuppType> => {
    switch (ast.type) {
      case AstType.Null:
      case AstType.Bool:
      case AstType.Num:
      case AstType.Str:
        return (ast as AstNodeValue<SuppType>).value

      case AstType.Attr:
        return this.executeAttr(ast as AstNodeAttr)

      case AstType.Func:
        return this.executeFunc(ast as AstNodeFunc)

      case AstType.BinOp:
        return this.executeBinOp(ast as AstNodeBinOp)

      case AstType.CmpOp:
        return this.executeCmpOp(ast as AstNodeCmpOp)

      case AstType.BoolOp:
        return this.executeBoolOp(ast as AstNodeBoolOp)
    }
  }

  Execute () {
    return this.execute(this.ast)
  }

  static Execute (ast: AstNode, context: Context) {
    return new Executor(ast, context).Execute()
  }
}
