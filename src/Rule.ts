import { type } from './utils'
import { Target } from './Target'
import { Namespace } from './Namespace'
import { Condition } from './Condition'
import { Context } from './context'

export class Rule {
  readonly name: type.TString
  private readonly target: Target
  private readonly namespace?: Namespace

  private readonly conditions: Map<string, Condition> = new Map()

  constructor ({
    name,
    target,
    namespace
  }: {
    name: type.TString,
    target: Target,
    namespace?: Namespace
  }) {
    this.name = name
    this.target = target
    this.namespace = namespace
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

  async execute (context: Context) : type.TResult {
    const target = await this.target.execute(context)

    if (!target) {
      return 'notApplicable'
    }
  }
}
