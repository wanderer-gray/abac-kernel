import { isBoolean } from '../Type'
import { TAst } from '../Ast'
import { Namespace } from '../Namespace'
import { Context } from '../Context'
import { TEffectSimple } from '../Effect'
import { ExecutorBase } from './ExecutorBase'

export class Executor extends ExecutorBase {
  protected async Execute () {
    const value = await this.execute(this.ast)

    if (!isBoolean(value)) {
      this.error('Expected result boolean')
    }

    return value
  }

  static async Execute (ast: TAst, namespace: Namespace, context: Context) : Promise<TEffectSimple> {
    try {
      const result = await new Executor(ast, namespace, context).Execute()

      return result ? 'permit' : 'deny'
    } catch {
      return 'error'
    }
  }
}
