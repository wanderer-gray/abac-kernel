import { TObject } from './Type'
import { ABAC } from './ABAC'

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

  then () {
    return Promise.resolve()
  }
}
