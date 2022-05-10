import { TAst } from './Ast'
import { Namespace } from './Namespace'
import { Context } from './context'
import { Executor } from './Executor'

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

  execute (namespace: Namespace, context: Context) {
    return Executor.Execute(this.ast, namespace, context)
  }
}
