import { type } from './utils'
import { Condition } from './Condition'

export class Rule {
  readonly name: type.TString
  private readonly target: Condition

  private readonly conditions: Map<string, Condition> = new Map()

  constructor ({
    name,
    target
  }: {
    name: type.TString,
    target: Condition
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

  execute () { }
}
