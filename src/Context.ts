import { ABAC } from './ABAC'
import { SuppType } from './common'

export type Data = {[attr: string]: SuppType}

export class Context {
  readonly abac: ABAC
  private readonly data: Data

  constructor (abac: ABAC, data: Data) {
    this.abac = abac
    this.data = data
  }

  getAttr (attr: string) : SuppType {
    return this.data[attr] ?? null
  }

  then () {
    return Promise.resolve()
  }
}
