import { TAst } from './Ast'
import { Context } from './context'
import { Executor } from './Executor'
import { TResult } from './Result'

export class Condition {
  readonly name: string
  private readonly ast: TAst

  constructor ({
    name,
    ast
  }: {
    name: string,
    ast: TAst
  }) {
    this.name = name
    this.ast = ast
  }

  async execute (context: Context) : Promise<TResult> {
    try {
      const result = await Executor.Execute(this.ast, context)

      if (result) {
        return 'permit'
      }

      return 'deny'
    } catch {
      return 'error'
    }
  }
}
