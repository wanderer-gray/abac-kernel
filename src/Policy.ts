import { Condition } from './Condition'
import { Rule } from './Rule'
import { Context } from './context'
import { TResult } from './Result'

export class Policy {
  readonly name: string
  private readonly target: Condition

  private readonly rules: Map<string, Rule> = new Map()

  constructor ({
    name,
    target
  }: {
    name: string,
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

  async execute (context: Context): Promise<TResult> {
    const target = await this.target.execute(context)

    if (!target) {
      return 'none'
    }

    return 'permit'
  }
}
