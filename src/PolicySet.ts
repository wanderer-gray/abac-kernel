import { type } from './utils'
import { Condition } from './Condition'
import { Policy } from './Policy'

export class PolicySet {
  readonly name: type.TString
  private readonly target: Condition

  private readonly policies: Map<string, Policy> = new Map()

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

  execute () { }
}
