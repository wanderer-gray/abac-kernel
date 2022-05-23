import { Target } from './Target'
import {
  TEffect,
  TEffectСomplex
} from './Effect'
import { Condition } from './Condition'
import { Namespace } from './Namespace'
import { Context } from './Context'
import { IExecute } from './Algorithm'

type TConfig = {
  name: string,
  effect: TEffect,
  target?: Target,
  condition: Condition,
  namespace?: Namespace
}

export class Rule implements IExecute {
  readonly name: string
  private readonly effect: TEffect
  private readonly target?: Target
  private readonly condition: Condition
  private readonly namespace?: Namespace

  constructor ({ name, effect, target, condition, namespace }: TConfig) {
    this.name = name
    this.effect = effect
    this.target = target
    this.condition = condition
    this.namespace = namespace
  }

  private handlerDeny = () => {
    return <TEffectСomplex>'none'
  }

  private handlerError = () => {
    return <TEffectСomplex>{
      permit: 'error_p',
      deny: 'error_d'
    }[this.effect]
  }

  private handlerConditionPermit = () => {
    return this.effect
  }

  executeTarget = async (namespace: Namespace, context: Context) => {
    return this.target?.execute(this.namespace ?? namespace, context) ?? 'permit'
  }

  executeElements = async (namespace: Namespace, context: Context) => {
    const result = await this.condition.execute(this.namespace ?? namespace, context)

    return {
      permit: this.handlerConditionPermit,
      deny: this.handlerDeny,
      error: this.handlerError
    }[result]()
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
    return new Rule(config)
  }
}
