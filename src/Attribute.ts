import {
  TSupport,
  TObject,
  isObject
} from './Type'
import {
  TSchema,
  verify
} from './Schema'
import { Context } from './context'

type TComputer = (data: TObject) => Promise<TSupport>

type TConfig = {
  name: string,
  path: string[],
  schema: TSchema,
  computer?: TComputer
}

export class Attribute {
  readonly name: string
  private readonly path: string[]
  private readonly schema: TSchema
  private readonly computer?: TComputer

  constructor ({ name, path, schema, computer }: TConfig) {
    this.name = name
    this.path = path
    this.schema = schema
    this.computer = computer
  }

  private error (message: string): never {
    throw new Error(`Argument[${this.name}]: ${message}`)
  }

  private getByPath (data: TObject) {
    let value: TSupport = data

    for (const key of this.path) {
      if (!isObject(value)) {
        return { ok: false, value: null }
      }

      value = value[key]
    }

    return { ok: true, value }
  }

  private async getByComputer (data: TObject) {
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

    if (!verify(value, this.schema)) {
      this.error(`Invalid value: ${value}`)
    }

    return value
  }

  static make (config: TConfig) {
    return new Attribute(config)
  }
}
