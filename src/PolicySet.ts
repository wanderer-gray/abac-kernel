import { Target } from './Target'
import { TEffectСomplex } from './Effect'
import { Policy } from './Policy'
import { Namespace } from './Namespace'
import { Context } from './Context'
import {
  IExecute,
  TAlgorithmPolicy,
  executeElements,
  handlerError
} from './Algorithm'

type TConfig = {
  name: string,
  target: Target,
  algorithm: TAlgorithmPolicy,
  namespace?: Namespace
}

export class PolicySet implements IExecute {
  readonly name: string
  private readonly target: Target
  private readonly algorithm: TAlgorithmPolicy
  private readonly policies: Policy[] = []
  private readonly namespace?: Namespace

  constructor ({ name, target, algorithm, namespace }: TConfig) {
    this.name = name
    this.target = target
    this.algorithm = algorithm
    this.namespace = namespace
  }

  private error (message: string): never {
    throw new Error(`PolicySet[${this.name}]: ${message}`)
  }

  hasPolicy (name: string) {
    return this.policies.some((policy) => policy.name === name)
  }

  addPolicy (policy: Policy) {
    const policyName = policy.name

    if (this.hasPolicy(policyName)) {
      this.error(`Policy "${policyName}" exists`)
    }

    this.policies.push(policy)

    return this
  }

  addPolicies (policies: Policy[]) {
    for (const policy of policies) {
      this.addPolicy(policy)
    }

    return this
  }

  private handlerDeny = () => {
    return <TEffectСomplex>'none'
  }

  private handlerError = (namespace: Namespace, context: Context) => {
    return handlerError(this.algorithm, this.policies, this.namespace ?? namespace, context)
  }

  executeTarget = (namespace: Namespace, context: Context) => {
    return this.target.execute(this.namespace ?? namespace, context)
  }

  executeElements = (namespace: Namespace, context: Context) => {
    return executeElements(this.algorithm, this.policies, this.namespace ?? namespace, context)
  }

  async execute (namespace: Namespace, context: Context) {
    const result = await this.executeTarget(namespace, context)

    return {
      permit: this.executeElements,
      deny: this.handlerDeny,
      error: this.handlerError
    }[result](namespace, context)
  }

  static new (config: TConfig) {
    return new PolicySet(config)
  }
}
