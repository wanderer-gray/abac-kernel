import { TObject } from './Type'
import { Namespace } from './Namespace'
import { PolicySet } from './PolicySet'
import { Context } from './Context'

export class ABAC {
  readonly namespace: Namespace
  private readonly policySets: Map<string, PolicySet> = new Map()

  constructor ({
    namespace
  }: {
    namespace: Namespace
  }) {
    this.namespace = namespace
  }

  private error (message: string): never {
    throw new Error(`ABAC: ${message}`)
  }

  private hasPolicySet (name: string) {
    return this.policySets.has(name)
  }

  private assertPolicySet (policySet: PolicySet) {
    const policySetName = policySet.name

    if (this.hasPolicySet(policySetName)) {
      this.error(`PolicySet "${policySetName}" exists`)
    }
  }

  addPolicySet (policySet: PolicySet) {
    this.assertPolicySet(policySet)

    this.policySets.set(policySet.name, policySet)

    return this
  }

  Context (data: TObject) {
    return new Context({
      abac: this,
      data
    })
  }
}
