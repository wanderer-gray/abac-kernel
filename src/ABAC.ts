import { TObject } from './Type'
import { Namespace } from './Namespace'
import { PolicySet } from './PolicySet'
import { Context } from './Context'
import {
  TAlgorithmPolicy,
  executeElements
} from './Algorithm'

export class ABAC {
  private readonly namespace: Namespace
  private readonly algorithm: TAlgorithmPolicy
  private readonly policySets: PolicySet[] = []

  constructor ({
    namespace,
    algorithm = 'only-one-applicable'
  }: {
    namespace: Namespace
    algorithm?: TAlgorithmPolicy
  }) {
    if (namespace.root !== undefined) {
      this.error('namespace should not have a dependency')
    }

    this.namespace = namespace
    this.algorithm = algorithm
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
    return executeElements(this.algorithm, this.policySets, this.namespace, context)
  }

  Context (data: TObject) {
    return new Context({
      data,
      abac: this
    })
  }
}
