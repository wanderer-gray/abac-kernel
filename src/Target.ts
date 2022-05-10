import { TAst } from './Ast'
import { Namespace } from './Namespace'
import { Context } from './Context'
import { Executor } from './Executor'

export class Target {
  private readonly ast: TAst

  constructor (ast: TAst) {
    this.ast = ast
  }

  execute (namespace: Namespace, context: Context) {
    return Executor.Execute(this.ast, namespace, context)
  }
}
