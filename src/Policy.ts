import { type } from './utils'
import { Condition } from './Condition'
import { Rule } from './Rule'

export class Policy {
  readonly name: type.TString
  private readonly target: Condition

  private readonly rules: Map<string, Rule> = new Map()

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
    throw new Error(`Policy[${this.name}]: ${message}`)
  }

  private hasRule (name: string) {
    return this.rules.has(name)
  }

  private assertRule (rule: Rule) {
    const ruleName = rule.name

    if (this.hasRule(ruleName)) {
      this.error(`Rule "${ruleName}" exists`)
    }
  }

  addRule (rule: Rule) {
    this.assertRule(rule)

    this.rules.set(rule.name, rule)

    return this
  }

  execute () { }
}
