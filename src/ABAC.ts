import { type } from './utils'
import { Namespace } from './Namespace'
import { PolicySet } from './PolicySet'
import { Context } from './Context'

export class ABAC {
  readonly defaultNamespace: Namespace
  private readonly namespaces: Map<string, Namespace> = new Map()
  private readonly policySets: Map<string, PolicySet> = new Map()

  constructor ({
    defaultNamespace
  }: {
    defaultNamespace: Namespace
  }) {
    this.defaultNamespace = defaultNamespace
  }

  private error (message: string): never {
    throw new Error(`ABAC: ${message}`)
  }

  private hasNamespace (name: string) {
    return this.namespaces.has(name)
  }

  private assertNamespace (namespace: Namespace) {
    const namespaceName = namespace.name

    if (this.hasNamespace(namespaceName)) {
      this.error(`Namespace "${namespaceName}" exists`)
    }
  }

  addNamespace (namespace: Namespace) {
    this.assertNamespace(namespace)

    this.namespaces.set(namespace.name, namespace)

    return this
  }

  // Может вернуть пространство имён по умолчанию
  getNamespace (name: string) {
    return this.namespaces.get(name) || this.defaultNamespace
  }

  private hasPolicySet (name: string) {
    return this.policySets.has(name)
  }

  private assertPolicySet (policySet: PolicySet) {
    const policySetName = policySet.name

    if (this.hasPolicySet(policySetName)) {
      this.error(`PolicySet "${policySetName}" exists`)
    }
  }

  addPolicySet (policySet: PolicySet) {
    this.assertPolicySet(policySet)

    this.policySets.set(policySet.name, policySet)

    return this
  }

  Context (data: type.TObject) {
    return new Context({
      abac: this,
      data
    })
  }
}
