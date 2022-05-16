import { TSupport } from './Type'
import {
  TSchema,
  verify
} from './Schema'

type TExecutor = (...args: TSupport[]) => Promise<TSupport>
type TArgsSettings = { schema: TSchema }[]
type TResultSettings = { schema: TSchema }

type TConfig = {
  name: string,
  executor: TExecutor,
  argsSettings: TArgsSettings,
  resultSettings: TResultSettings
}

export class Function {
  readonly name: string
  private readonly executor: TExecutor
  private readonly argsSettings: TArgsSettings
  private readonly resultSettings: TResultSettings

  constructor ({ name, executor, argsSettings, resultSettings }: TConfig) {
    this.name = name
    this.executor = executor
    this.argsSettings = argsSettings
    this.resultSettings = resultSettings
  }

  private error (message: string): never {
    throw new Error(`Function[${this.name}]: ${message}`)
  }

  private async getResult (args: TSupport[]) {
    try {
      return await this.executor.apply(undefined, args)
    } catch {
      return null
    }
  }

  async exec (args: TSupport[]) {
    const {
      argsSettings,
      resultSettings
    } = this

    if (args.length !== argsSettings.length) {
      this.error(`Expected number of arguments: ${argsSettings.length}`)
    }

    for (let index = 0; index < argsSettings.length; index++) {
      const value = args[index]

      if (!verify(value, argsSettings[index].schema)) {
        this.error(`Invalid argument (index: ${index}) value: ${value}`)
      }
    }

    const result = await this.getResult(args)

    if (!verify(result, resultSettings.schema)) {
      this.error(`Invalid result: ${result}`)
    }

    return result
  }

  static new (config: TConfig) {
    return new Function(config)
  }
}
