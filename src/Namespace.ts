import { type } from './utils'
import { Attribute } from './Attribute'
import { Function } from './Function'

type TName = type.TString

export class Namespace {
  readonly name: TName
  private readonly root?: Namespace

  private readonly attributes: Map<string, Attribute> = new Map()
  private readonly functions: Map<string, Function> = new Map()

  constructor ({
    name,
    root
  }: {
    name: TName,
    root?: Namespace
  }) {
    this.name = name
    this.root = root
  }

  private error (message: string): never {
    throw new Error(`Namespace[${this.name}]: ${message}`)
  }

  private hasAttribute (name: string) {
    return this.attributes.has(name)
  }

  private hasFunction (name: string) {
    return this.functions.has(name)
  }

  private hasPublicName (name: string) {
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

  private assertAttribute (attr: Attribute) {
    const attributeName = attr.name

    if (this.hasAttribute(attributeName)) {
      this.error(`Attribute "${attributeName}" exists`)
    }

    this.assertPublicName(attributeName)
  }

  addAttribute (attr: Attribute) {
    this.assertAttribute(attr)

    this.attributes.set(attr.name, attr)

    return this
  }

  getAttribute (name: string): Attribute | null {
    return this.attributes.get(name) || this.root?.getAttribute(name) || null
  }

  private assertFunction (func: Function) {
    const functionName = func.name

    if (this.hasFunction(functionName)) {
      this.error(`Function "${functionName}" exists`)
    }

    this.assertPublicName(functionName)
  }

  addFunction (func: Function) {
    this.assertFunction(func)

    this.functions.set(func.name, func)

    return this
  }

  getFunction (name: string): Function | null {
    return this.functions.get(name) || this.root?.getFunction(name) || null
  }
}
