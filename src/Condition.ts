import { TAst } from './Ast'
import { Namespace } from './Namespace'
import { Context } from './Context'
import { Executor } from './Executor'

type TConfig = {
  name: string,
  code: TAst
}

export class Condition {
  readonly name: string
  private readonly code: TAst

  constructor ({ name, code }: TConfig) {
    this.name = name
    this.code = code
  }

  execute (namespace: Namespace, context: Context) {
    return Executor.Execute(this.code, namespace, context)
  }

  static new (config: TConfig) {
    return new Condition(config)
  }
}
