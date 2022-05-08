import { type } from './utils'
import VM, { AstNode } from './vm'
import { Context } from './context'

export class Condition {
  readonly name: type.TString
  private readonly code: AstNode

  constructor ({
    name,
    code
  }: {
    name: type.TString,
    code: AstNode
  }) {
    this.name = name
    this.code = code
  }

  // @todo Добавить типы результата условия !!!!!!
  execute (context: Context) {
    return VM.Execute(this.code, context)
  }
}
