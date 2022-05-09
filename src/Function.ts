import { TSupport } from './Type'
import * as Schema from './Schema'

export class Function {
  readonly name: string
  private readonly input: { schema: Schema.TSchema }[]
  private readonly output: { schema: Schema.TSchema }
  private readonly executor: (...args: TSupport[]) => Promise<TSupport>

  constructor ({
    name,
    input,
    output,
    executor
  }: {
    name: string,
    input: { schema: Schema.TSchema }[],
    output: { schema: Schema.TSchema },
    executor: (...args: TSupport[]) => Promise<TSupport>
  }) {
    this.name = name
    this.input = input
    this.output = output
    this.executor = executor
  }

  private error (message: string): never {
    throw new Error(`Function[${this.name}]: ${message}`)
  }

  private assertArgs (args: TSupport[]) {
    const { input } = this

    if (args.length !== input.length) {
      this.error(`Expected number of arguments: ${input.length}`)
    }

    for (let index = 0; index < input.length; index++) {
      const value = args[index]

      if (!Schema.verify(value, input[index].schema)) {
        this.error(`Invalid argument (index: ${index}) value: ${value}`)
      }
    }
  }

  private assertResult (result: TSupport) {
    if (!Schema.verify(result, this.output.schema)) {
      this.error(`Invalid result: ${result}`)
    }
  }

  private async getResult (args: TSupport[]) {
    try {
      return await this.executor.apply(undefined, args)
    } catch {
      return null
    }
  }

  async exec (args: TSupport[]) {
    this.assertArgs(args)

    const result = await this.getResult(args)

    this.assertResult(result)

    return result
  }
}
