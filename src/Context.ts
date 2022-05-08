import { type } from './utils'
import { ABAC } from './ABAC'
import { Namespace } from './Namespace'

export class Context {
  private readonly data: type.TObject

  private namespace: Namespace

  constructor ({
    abac,
    data
  }: {
    abac: ABAC,
    data: type.TObject
  }) {
    this.data = data

    this.namespace = abac.defaultNamespace
  }

  getData () {
    return this.data
  }

  setNamespace (namespace: Namespace) {
    this.namespace = namespace
  }

  getAttribute (name: string) {
    return this.namespace.getAttribute(name)
  }

  getFunction (name: string) {
    return this.namespace.getFunction(name)
  }

  then () {
    return Promise.resolve()
  }
}
