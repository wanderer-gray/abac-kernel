import { type } from './utils'
import * as Schema from './Schema'

type TData = type.TObject
type TValue = type.TSupport

type TName = type.TString
type TPath = type.TArray<type.TString>
type TSchema = Schema.TSchema
type TComputer = (data: TData) => Promise<TValue>

export class Attribute {
  readonly name: TName
  private readonly path: TPath
  private readonly schema: TSchema
  private readonly computer?: TComputer

  constructor ({
    name,
    path,
    schema,
    computer
  }: {
    name: TName,
    path: TPath,
    schema: TSchema,
    computer?: TComputer
  }) {
    this.name = name
    this.path = path
    this.schema = schema
    this.computer = computer
  }

  private error (message: string): never {
    throw new Error(`Argument[${this.name}]: ${message}`)
  }

  private assertValue (value: TValue) {
    if (!Schema.verify(value, this.schema)) {
      this.error(`Invalid value: ${value}`)
    }
  }

  private getByPath (data: TData) {
    let value: TValue = data

    for (const key of this.path) {
      if (!type.isObject(value)) {
        return { ok: false, value: null }
      }

      value = value[key]
    }

    return { ok: true, value }
  }

  private async getByComputer (data: TData) {
    const { computer } = this

    if (!computer) {
      return { ok: false, value: null }
    }

    try {
      const value = await computer(data)

      return { ok: true, value }
    } catch {
      return { ok: false, value: null }
    }
  }

  private async getValue (data: TData) {
    const valueByPath = this.getByPath(data)

    if (valueByPath.ok) {
      return valueByPath.value
    }

    const valueByComputer = await this.getByComputer(data)

    if (valueByComputer.ok) {
      return valueByComputer.value
    }

    return null
  }

  async get (data: TData) {
    const value = await this.getValue(data)

    this.assertValue(value)

    return value
  }
}
