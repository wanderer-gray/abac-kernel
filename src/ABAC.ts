import { TObject } from './Type'
import { Namespace } from './Namespace'
import { PolicySet } from './PolicySet'
import { Context } from './Context'
import {
  TAlgorithm,
  executeElements
} from './Algorithm'

type TConfig = {
  namespace: Namespace
  algorithm?: TAlgorithm
}

export class ABAC {
  private readonly namespace: Namespace
  private readonly algorithm: TAlgorithm
  private readonly policySets: PolicySet[] = []

  constructor ({ namespace, algorithm = 'only-one-applicable' }: TConfig) {
    if (namespace.root !== undefined) {
      this.error('Namespace should not have a dependency')
    }

    this.namespace = namespace
    this.algorithm = algorithm
  }

  private error (message: string): never {
    throw new Error(`ABAC: ${message}`)
  }

  hasPolicySet (name: string) {
    return this.policySets.some((policySet) => policySet.name === name)
  }

  addPolicySet (policySet: PolicySet) {
    const policySetName = policySet.name

    if (this.hasPolicySet(policySetName)) {
      this.error(`PolicySet "${policySetName}" exists`)
    }

    this.policySets.push(policySet)

    return this
  }

  execute (context: Context) {
    return executeElements(this.algorithm, this.policySets, this.namespace, context)
  }

  Context (data: TObject) {
    return Context.make({ abac: this, data })
  }

  static make (config: TConfig) {
    return new ABAC(config)
  }
}
