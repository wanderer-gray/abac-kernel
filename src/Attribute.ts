import { type } from './utils'
import * as Schema from './Schema'
import { Context } from './context'

export class Attribute {
  readonly name: type.TString
  private readonly path: type.TArray<type.TString>
  private readonly schema: Schema.TSchema
  private readonly computer?: (data: type.TObject) => Promise<type.TSupport>

  constructor ({
    name,
    path,
    schema,
    computer
  }: {
    name: type.TString,
    path: type.TArray<type.TString>,
    schema: Schema.TSchema,
    computer?: (data: type.TObject) => Promise<type.TSupport>
  }) {
    this.name = name
    this.path = path
    this.schema = schema
    this.computer = computer
  }

  private error (message: string): never {
    throw new Error(`Argument[${this.name}]: ${message}`)
  }

  private assertValue (value: type.TSupport) {
    if (!Schema.verify(value, this.schema)) {
      this.error(`Invalid value: ${value}`)
    }
  }

  private getByPath (data: type.TObject) {
    let value: type.TSupport = data

    for (const key of this.path) {
      if (!type.isObject(value)) {
        return { ok: false, value: null }
      }

      value = value[key]
    }

    return { ok: true, value }
  }

  private async getByComputer (data: type.TObject) {
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

  private async getValue (context: Context) {
    const data = context.getData()

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

  async get (context: Context) {
    const value = await this.getValue(context)

    this.assertValue(value)

    return value
  }
}
