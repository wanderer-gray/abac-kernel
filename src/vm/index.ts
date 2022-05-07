import { AstNode } from './AstNode'
import { Context } from '../context'
import { Parser } from './parser'
import { Executor } from './executor'

export class VM {
  static Parse (source: string) {
    return Parser.Parse(source)
  }

  static Execute (ast: AstNode, context: Context) {
    return Executor.Execute(ast, context)
  }

  static ParseAndExecute (source: string, context: Context) {
    return VM.Execute(VM.Parse(source), context)
  }
}
