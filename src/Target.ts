import { type } from './utils'
import { Context } from './context'
import { Executor } from './Executor'

export class Target {
  private readonly ast: type.TAst

  constructor (ast: type.TAst) {
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
