import { TObject } from './Type'
import { ABAC } from './ABAC'
import { TEffectСomplex } from './Effect'

type TResolve = (value: TEffectСomplex) => void
type TReject = (reason?: Error) => void

type TConfig = {
  abac: ABAC,
  data: TObject
}

export class Context {
  private readonly abac: ABAC
  private readonly data: TObject

  constructor ({ abac, data }: TConfig) {
    this.data = data
    this.abac = abac
  }

  getData () {
    return this.data
  }

  then (resolve: TResolve, reject: TReject) {
    return this.abac.execute(this)
      .then(resolve)
      .catch(reject)
  }

  catch (reject: TReject) {
    return this.abac.execute(this)
      .catch(reject)
  }

  static make (config: TConfig) {
    return new Context(config)
  }
}
