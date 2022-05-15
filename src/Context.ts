import { TObject } from './Type'
import { ABAC } from './ABAC'
import { TEffectСomplex } from './Effect'

export class Context {
  private readonly data: TObject
  private readonly abac: ABAC

  constructor ({
    data,
    abac
  }: {
    data: TObject,
    abac: ABAC
  }) {
    this.data = data
    this.abac = abac
  }

  getData () {
    return this.data
  }

  then (resolve: (value: TEffectСomplex) => void, reject: (reason?: Error) => void) {
    return this.abac.execute(this)
      .then(resolve)
      .catch(reject)
  }

  catch (reject: (reason?: Error) => void) {
    return this.abac.execute(this)
      .catch(reject)
  }
}
