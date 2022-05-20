import { Attribute } from './Attribute'
import { Function } from './Function'

type TConfig<Namespace> = {
  name: string,
  root?: Namespace
}

export class Namespace {
  readonly name: string
  readonly root?: Namespace

  private readonly _attributes: Map<string, Attribute> = new Map()
  private readonly _functions: Map<string, Function> = new Map()

  constructor ({ name, root }: TConfig<Namespace>) {
    this.name = name
    this.root = root
  }

  get attributes () {
    return [...this._attributes.values()]
  }

  get functions () {
    return [...this._functions.values()]
  }

  private error (message: string): never {
    throw new Error(`Namespace[${this.name}]: ${message}`)
  }

  hasAttribute (name: string) {
    return this._attributes.has(name)
  }

  hasFunction (name: string) {
    return this._functions.has(name)
  }

  hasPublicName (name: string) {
    if (this.hasAttribute(name)) {
      return true
    }

    if (this.hasFunction(name)) {
      return true
    }

    if (this.root?.hasPublicName(name)) {
      return true
    }

    return false
  }

  private assertPublicName (name: string) {
    if (this.hasPublicName(name)) {
      this.error('Attribute name and function name must be different')
    }
  }

  addAttribute (attr: Attribute) {
    const attributeName = attr.name

    if (this.hasAttribute(attributeName)) {
      this.error(`Attribute "${attributeName}" exists`)
    }

    this.assertPublicName(attributeName)

    this._attributes.set(attributeName, attr)

    return this
  }

  getAttribute (name: string): Attribute {
    const attr = this._attributes.get(name) || this.root?.getAttribute(name)

    if (!attr) {
      this.error(`Attribute "${name}" not found`)
    }

    return attr
  }

  addFunction (func: Function) {
    const functionName = func.name

    if (this.hasFunction(functionName)) {
      this.error(`Function "${functionName}" exists`)
    }

    this.assertPublicName(functionName)

    this._functions.set(functionName, func)

    return this
  }

  getFunction (name: string): Function {
    const func = this._functions.get(name) || this.root?.getFunction(name)

    if (!func) {
      this.error(`Function "${name}" not found`)
    }

    return func
  }

  static new (config: TConfig<Namespace>) {
    return new Namespace(config)
  }
}
