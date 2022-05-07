import { type } from './utils'
import * as Schema from './Schema'

type TArgs = type.TSupport[]
type TResult = type.TSupport

type TName = type.TString
type TInput = { schema: Schema.TSchema }[]
type TOutput = { schema: Schema.TSchema }
type TExecutor = (...args: TArgs) => Promise<TResult>

export class Function {
  readonly name: TName
  private readonly input: TInput
  private readonly output: TOutput
  private readonly executor: TExecutor

  constructor ({
    name,
    input,
    output,
    executor
  }: {
    name: TName,
    input: TInput,
    output: TOutput,
    executor: TExecutor
  }) {
    this.name = name
    this.input = input
    this.output = output
    this.executor = executor
  }

  private error (message: string): never {
    throw new Error(`Function[${this.name}]: ${message}`)
  }

  private assertArgs (args: TArgs) {
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

  private assertResult (result: TResult) {
    if (!Schema.verify(result, this.output.schema)) {
      this.error(`Invalid result: ${result}`)
    }
  }

  private async getResult (args: TArgs) {
    try {
      return await this.executor.apply(undefined, args)
    } catch {
      return null
    }
  }

  async execute (args: TArgs) {
    this.assertArgs(args)

    const result = await this.getResult(args)

    this.assertResult(result)

    return result
  }
}
