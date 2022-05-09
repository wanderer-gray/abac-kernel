import { Target } from './Target'
import { Condition } from './Condition'
import { Context } from './context'
import { TResult } from './Result'

export class Rule {
  readonly name: string
  private readonly target: Target

  private readonly conditions: Map<string, Condition> = new Map()

  constructor ({
    name,
    target
  }: {
    name: string,
    target: Target
  }) {
    this.name = name
    this.target = target
  }

  private error (message: string): never {
    throw new Error(`Rule[${this.name}]: ${message}`)
  }

  private hasCondition (name: string) {
    return this.conditions.has(name)
  }

  private assertCondition (condition: Condition) {
    const conditionName = condition.name

    if (this.hasCondition(conditionName)) {
      this.error(`Condition "${conditionName}" exists`)
    }
  }

  addCondition (condition: Condition) {
    this.assertCondition(condition)

    this.conditions.set(condition.name, condition)

    return this
  }

  async execute (context: Context): Promise<TResult> {
    const target = await this.target.execute(context)

    if (!target) {
      return 'none'
    }

    return 'permit'
  }
}
