import { Target } from './Target'
import { TEffectСomplex } from './Effect'
import { Rule } from './Rule'
import { Namespace } from './Namespace'
import { Context } from './Context'
import {
  IExecute,
  TAlgorithmRule,
  executeElements,
  handlerError
} from './Algorithm'

type TConfig = {
  name: string,
  target: Target,
  algorithm: TAlgorithmRule,
  namespace?: Namespace
}

export class Policy implements IExecute {
  readonly name: string
  private readonly target: Target
  private readonly algorithm: TAlgorithmRule
  private readonly rules: Rule[] = []
  private readonly namespace?: Namespace

  constructor ({ name, target, algorithm, namespace }: TConfig) {
    this.name = name
    this.target = target
    this.algorithm = algorithm
    this.namespace = namespace
  }

  private error (message: string): never {
    throw new Error(`Policy[${this.name}]: ${message}`)
  }

  hasRule (name: string) {
    return this.rules.some((rule) => rule.name === name)
  }

  addRule (rule: Rule) {
    const ruleName = rule.name

    if (this.hasRule(ruleName)) {
      this.error(`Rule "${ruleName}" exists`)
    }

    this.rules.push(rule)

    return this
  }

  addRules (rules: Rule[]) {
    for (const rule of rules) {
      this.addRule(rule)
    }

    return this
  }

  private handlerDeny = () => {
    return <TEffectСomplex>'none'
  }

  private handlerError = (namespace: Namespace, context: Context) => {
    return handlerError(this.algorithm, this.rules, this.namespace ?? namespace, context)
  }

  executeTarget = (namespace: Namespace, context: Context) => {
    return this.target.execute(this.namespace ?? namespace, context)
  }

  executeElements = (namespace: Namespace, context: Context) => {
    return executeElements(this.algorithm, this.rules, this.namespace ?? namespace, context)
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
    return new Policy(config)
  }
}
