import { ParserValue } from './ParserValue'
import { AstNode, AstNodeAttr, AstNodeFunc, AstNodeBinOp } from '../AstNode'
import { Char, BinOp } from '../common'

const isLetter = (ch: string) => /^[a-zA-Z_]$/.test(ch)

const isDigitOrLetter = (ch: string) => /^[0-9a-zA-Z_]$/.test(ch)

export class ParserOperand extends ParserValue {
  private getBind () {
    if (!isLetter(this.peek())) {
      return null
    }

    let name = ''

    for (; isDigitOrLetter(this.peek()); this.next()) {
      name += this.peek()
    }

    this.skip()

    return name
  }

  private getAttr () {
    const attr = this.getBind()

    if (!attr || this.searchIText(Char.Lpar)) {
      return null
    }

    return new AstNodeAttr(attr)
  }

  private getFunc () {
    const func = this.getBind()

    if (!func || !this.searchIText(Char.Lpar)) {
      return null
    }

    const args: AstNode[] = []

    let arg = this.getOperand()

    while (arg) {
      args.push(arg)

      if (!this.searchIText(Char.Comma)) {
        break
      }

      arg = this.getOperand()

      if (!arg) {
        this.error('Expected arg')
      }
    }

    if (!this.searchIText(Char.Rpar)) {
      this.error('Expected rpar')
    }

    return new AstNodeFunc(func, args)
  }

  private getGroup () {
    if (!this.searchIText(Char.Lpar)) {
      return null
    }

    const operand = this.getOperand()

    if (!operand) {
      this.error('Expected operand')
    }

    if (!this.searchIText(Char.Rpar)) {
      this.error('Expected rpar')
    }

    return operand
  }

  private getTerm () {
    return this.searchNode(
      this.getValue,
      this.getAttr,
      this.getFunc,
      this.getGroup
    )
  }

  private getFactor () {
    let left = this.getTerm()

    if (!left) {
      return null
    }

    for (;;) {
      const binOp = this.searchIText(BinOp.FloorDiv, BinOp.Mult, BinOp.Div, BinOp.Mod)

      if (!binOp) {
        return left
      }

      const right = this.getTerm()

      if (!right) {
        this.error('Expected right')
      }

      left = new AstNodeBinOp(binOp, [left, right])
    }
  }

  private getSummand () {
    let left = this.getFactor()

    if (!left) {
      return null
    }

    for (;;) {
      const binOp = this.searchIText(BinOp.Add, BinOp.Sub)

      if (!binOp) {
        return left
      }

      const right = this.getFactor()

      if (!right) {
        this.error('Expected right')
      }

      left = new AstNodeBinOp(binOp, [left, right])
    }
  }

  protected getOperand () : AstNode | null {
    return this.getSummand()
  }
}
