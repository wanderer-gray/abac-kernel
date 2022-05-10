import { TObject } from './Type'
import { Namespace } from './Namespace'
import { PolicySet } from './PolicySet'
import { Context } from './Context'
import { executeElements } from './Algorithm'

export class ABAC {
  readonly defaultNamespace: Namespace
  private readonly policySets: PolicySet[] = []

  constructor ({
    defaultNamespace
  }: {
    defaultNamespace: Namespace
  }) {
    this.defaultNamespace = defaultNamespace
  }

  private error (message: string): never {
    throw new Error(`ABAC: ${message}`)
  }

  private hasPolicySet (name: string) {
    return this.policySets.some((policySet) => policySet.name === name)
  }

  private assertPolicySet (policySet: PolicySet) {
    const policySetName = policySet.name

    if (this.hasPolicySet(policySetName)) {
      this.error(`PolicySet "${policySetName}" exists`)
    }
  }

  addPolicySet (policySet: PolicySet) {
    this.assertPolicySet(policySet)

    this.policySets.push(policySet)

    return this
  }

  execute (context: Context) {
    return executeElements('only-one-applicable', this.policySets, this.defaultNamespace, context)
  }

  Context (data: TObject) {
    return new Context({
      data,
      abac: this
    })
  }
}
