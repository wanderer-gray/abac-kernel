import { type } from './utils'
import { Context } from './context'
import { Executor } from './Executor'

export class Condition {
  readonly name: type.TString
  private readonly ast: type.TAst

  constructor ({
    name,
    ast
  }: {
    name: type.TString,
    ast: type.TAst
  }) {
    this.name = name
    this.ast = ast
  }

  async execute (context: Context) : Promise<type.TResult> {
    try {
      const result = await Executor.Execute(this.ast, context)

      return result ? 'permit' : 'deny'
    } catch {
      return 'indeterminate'
    }
  }
}
