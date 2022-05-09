import { isBoolean } from '../Type'
import { TAst } from '../Ast'
import { Context } from '../Context'
import { ExecutorBase } from './ExecutorBase'

export class Executor extends ExecutorBase {
  async Execute () {
    const value = await this.execute(this.ast)

    if (!isBoolean(value)) {
      this.error('Expected result boolean')
    }

    return value
  }

  static Execute (ast: TAst, context: Context) {
    return new Executor(ast, context).Execute()
  }
}
