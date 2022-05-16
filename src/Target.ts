import { TAst } from './Ast'
import { Namespace } from './Namespace'
import { Context } from './Context'
import { Executor } from './Executor'

type TConfig = {
  code: TAst
}

export class Target {
  private readonly code: TAst

  constructor ({ code }: TConfig) {
    this.code = code
  }

  execute (namespace: Namespace, context: Context) {
    return Executor.Execute(this.code, namespace, context)
  }

  static new (config: TConfig) {
    return new Target(config)
  }
}
