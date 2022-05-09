import { TAst } from './Ast'
import { Context } from './Context'
import { Executor } from './Executor'

export class Target {
  private readonly ast: TAst

  constructor (ast: TAst) {
    this.ast = ast
  }

  async execute (context: Context) {
    try {
      return await Executor.Execute(this.ast, context)
    } catch {
      return false
    }
  }
}
