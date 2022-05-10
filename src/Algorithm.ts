import {
  TEffect,
  TEffectSimple,
  TEffectСomplex
} from './Effect'
import { Namespace } from './Namespace'
import { Context } from './Context'

interface IExecute {
  executeTarget: (namespace: Namespace, context: Context) => Promise<TEffectSimple>
  executeElements: (namespace: Namespace, context: Context) => Promise<TEffectСomplex>
  execute: (namespace: Namespace, context: Context) => Promise<TEffectСomplex>
}

type TAlgorithmRule =
  'deny-overrides' |
  'permit-overrides' |
  'first-applicable' |
  'ordered-deny-overrides' |
  'ordered-permit-overrides' |
  'deny-unless-permit' |
  'permit-unless-deny'

type TAlgorithmPolicy =
  'deny-overrides' |
  'permit-overrides' |
  'first-applicable' |
  'only-one-applicable' |
  'ordered-deny-overrides' |
  'ordered-permit-overrides' |
  'deny-unless-permit' |
  'permit-unless-deny'

async function executeDenyOverrides (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffectСomplex> {
  let atLeastOnePermit = false
  let atLeastOneErrorP = false
  let atLeastOneErrorD = false
  let atLeastOneErrorPD = false

  for (const element of elements) {
    const result = await element.execute(namespace, context)

    switch (result) {
      case 'permit':
        atLeastOnePermit = true
        break
      case 'deny':
        return result
      case 'error_p':
        atLeastOneErrorP = true
        break
      case 'error_d':
        atLeastOneErrorD = true
        break
      case 'error_pd':
        atLeastOneErrorPD = true
        break
    }
  }

  if (atLeastOneErrorPD) {
    return 'error_pd'
  }

  if (atLeastOneErrorD) {
    if (atLeastOnePermit || atLeastOneErrorP) {
      return 'error_pd'
    }

    return 'error_d'
  }

  if (atLeastOnePermit) {
    return 'permit'
  }

  if (atLeastOneErrorP) {
    return 'error_p'
  }

  return 'none'
}

async function executePermitOverrides (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffectСomplex> {
  let atLeastOneDeny = false
  let atLeastOneErrorP = false
  let atLeastOneErrorD = false
  let atLeastOneErrorPD = false

  for (const element of elements) {
    const result = await element.execute(namespace, context)

    switch (result) {
      case 'permit':
        return result
      case 'deny':
        atLeastOneDeny = true
        break
      case 'error_p':
        atLeastOneErrorP = true
        break
      case 'error_d':
        atLeastOneErrorD = true
        break
      case 'error_pd':
        atLeastOneErrorPD = true
        break
    }
  }

  if (atLeastOneErrorPD) {
    return 'error_pd'
  }

  if (atLeastOneErrorP) {
    if (atLeastOneDeny || atLeastOneErrorD) {
      return 'error_pd'
    }

    return 'error_p'
  }

  if (atLeastOneDeny) {
    return 'deny'
  }

  if (atLeastOneErrorD) {
    return 'error_d'
  }

  return 'none'
}

async function executeFirstApplicable (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffectСomplex> {
  for (const element of elements) {
    const result = await element.execute(namespace, context)

    switch (result) {
      case 'permit':
        return result
      case 'deny':
        return result
      case 'error_p':
      case 'error_d':
      case 'error_pd':
        return result
    }
  }

  return 'none'
}

async function executeOnlyOneApplicable (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffectСomplex> {
  let appElement : IExecute | null = null

  for (const element of elements) {
    const appResult = await element.executeTarget(namespace, context)

    switch (appResult) {
      case 'permit':
        if (appElement) {
          // Не точно!!!
          return 'error_pd'
        }

        appElement = element
        break
      case 'error':
        // Не точно!!!
        return 'error_pd'
    }
  }

  if (appElement) {
    return appElement.executeElements(namespace, context)
  }

  return 'none'
}

function executeOrderedDenyOverrides (elements: IExecute[], namespace: Namespace, context: Context) {
  return executeDenyOverrides(elements, namespace, context)
}

function executeOrderedPermitOverrides (elements: IExecute[], namespace: Namespace, context: Context) {
  return executePermitOverrides(elements, namespace, context)
}

async function executeDenyUnlessPermit (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffect> {
  for (const element of elements) {
    const result = await element.execute(namespace, context)

    if (result === 'permit') {
      return result
    }
  }

  return 'deny'
}

async function executePermitUnlessDeny (elements: IExecute[], namespace: Namespace, context: Context) : Promise<TEffect> {
  for (const element of elements) {
    const result = await element.execute(namespace, context)

    if (result === 'deny') {
      return result
    }
  }

  return 'permit'
}

function handlerPermit (algorithm: TAlgorithmRule | TAlgorithmPolicy, elements: IExecute[], namespace: Namespace, context: Context) {
  return {
    'deny-overrides': executeDenyOverrides,
    'permit-overrides': executePermitOverrides,
    'first-applicable': executeFirstApplicable,
    'only-one-applicable': executeOnlyOneApplicable,
    'ordered-deny-overrides': executeOrderedDenyOverrides,
    'ordered-permit-overrides': executeOrderedPermitOverrides,
    'deny-unless-permit': executeDenyUnlessPermit,
    'permit-unless-deny': executePermitUnlessDeny
  }[algorithm](elements, namespace, context)
}

async function handlerError (algorithm: TAlgorithmRule | TAlgorithmPolicy, elements: IExecute[], namespace: Namespace, context: Context) {
  const result = await handlerPermit(algorithm, elements, namespace, context)

  return <TEffectСomplex>{
    permit: 'error_p',
    deny: 'error_d',
    none: 'none',
    error_p: 'error_p',
    error_d: 'error_d',
    error_pd: 'error_pd'
  }[result]
}

export {
  IExecute,
  TAlgorithmRule,
  TAlgorithmPolicy,
  handlerPermit,
  handlerError
}
