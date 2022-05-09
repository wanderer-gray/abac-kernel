import { Condition } from './Condition'
import { Policy } from './Policy'
import { Context } from './context'
import { TResult } from './Result'

export class PolicySet {
  readonly name: string
  private readonly target: Condition

  private readonly policies: Map<string, Policy> = new Map()

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
    throw new Error(`PolicySet[${this.name}]: ${message}`)
  }

  private hasPolicy (name: string) {
    return this.policies.has(name)
  }

  private assertPolicy (policy: Policy) {
    const policyName = policy.name

    if (this.hasPolicy(policyName)) {
      this.error(`Policy "${policyName}" exists`)
    }
  }

  addPolicy (policy: Policy) {
    this.assertPolicy(policy)

    this.policies.set(policy.name, policy)

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
