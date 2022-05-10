type TEffect = 'permit' | 'deny'

type TEffectSimple = TEffect | 'error'

type TEffectСomplex = TEffect | 'none' | 'error_p' | 'error_d' | 'error_pd'

export {
  TEffect,
  TEffectSimple,
  TEffectСomplex
}
