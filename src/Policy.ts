import { Target } from './Target'
import { TEffectСomplex } from './Effect'
import { Rule } from './Rule'
import { Namespace } from './Namespace'
import { Context } from './context'
import {
  IExecute,
  TAlgorithmRule,
  handlerPermit,
  handlerError
} from './Algorithm'

export class Policy implements IExecute {
  readonly name: string
  private readonly target: Target
  private readonly algorithm: TAlgorithmRule
  private readonly rules: Rule[] = []
  private readonly namespace?: Namespace

  constructor ({
    name,
    target,
    algorithm,
    namespace
  }: {
    name: string,
    target: Target,
    algorithm: TAlgorithmRule,
    namespace?: Namespace
  }) {
    this.name = name
    this.target = target
    this.algorithm = algorithm
    this.namespace = namespace
  }

  private error (message: string): never {
    throw new Error(`Policy[${this.name}]: ${message}`)
  }

  private hasRule (name: string) {
    return this.rules.some((rule) => rule.name === name)
  }

  private assertRule (rule: Rule) {
    const ruleName = rule.name

    if (this.hasRule(ruleName)) {
      this.error(`Rule "${ruleName}" exists`)
    }
  }

  addRule (rule: Rule) {
    this.assertRule(rule)

    this.rules.push(rule)

    return this
  }

  private handlerDeny = () => {
    return <TEffectСomplex>'none'
  }

  private handlerError = async (namespace: Namespace, context: Context) => {
    return handlerError(this.algorithm, this.rules, this.namespace ?? namespace, context)
  }

  executeTarget = async (namespace: Namespace, context: Context) => {
    return this.target.execute(this.namespace ?? namespace, context)
  }

  executeElements = async (namespace: Namespace, context: Context) => {
    return handlerPermit(this.algorithm, this.rules, this.namespace ?? namespace, context)
  }

  async execute (namespace: Namespace, context: Context) {
    const result = await this.executeTarget(namespace, context)

    return {
      permit: this.executeElements,
      deny: this.handlerDeny,
      error: this.handlerError
    }[result](namespace, context)
  }
}
