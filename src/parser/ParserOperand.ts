import { char, binOp, type } from '../utils'
import { ParserValue } from './ParserValue'

export class ParserOperand extends ParserValue {
  private getBind () {
    if (!char.isLetter(this.peek())) {
      return null
    }

    let name = ''

    for (; char.isLetterOrDigit(this.peek()); this.next()) {
      name += this.peek()
    }

    this.skip()

    return name
  }

  private getAttr () : type.TAst | null {
    const name = this.getBind()

    if (!name || this.searchIText(char.Lpar)) {
      return null
    }

    return {
      type: 'attr',
      name
    }
  }

  private getFunc () : type.TAst | null {
    const name = this.getBind()

    if (!name || !this.searchIText(char.Lpar)) {
      return null
    }

    const args: type.TAst[] = []

    let arg = this.getOperand()

    while (arg) {
      args.push(arg)

      if (!this.searchIText(char.Comma)) {
        break
      }

      arg = this.getOperand()

      if (!arg) {
        this.error('Expected arg')
      }
    }

    if (!this.searchIText(char.Rpar)) {
      this.error('Expected rpar')
    }

    return {
      type: 'func',
      name,
      args
    }
  }

  private getGroup () {
    if (!this.searchIText(char.Lpar)) {
      return null
    }

    const operand = this.getOperand()

    if (!operand) {
      this.error('Expected operand')
    }

    if (!this.searchIText(char.Rpar)) {
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
      const op = this.searchIText(
        binOp.FloorDiv,
        binOp.Mult,
        binOp.Div,
        binOp.Mod
      )

      if (!op || !binOp.is(op)) {
        return left
      }

      const right = this.getTerm()

      if (!right) {
        this.error('Expected right')
      }

      left = {
        type: 'binOp',
        op,
        left,
        right
      }
    }
  }

  private getSummand () {
    let left = this.getFactor()

    if (!left) {
      return null
    }

    for (;;) {
      const op = this.searchIText(binOp.Add, binOp.Sub)

      if (!op || !binOp.is(op)) {
        return left
      }

      const right = this.getFactor()

      if (!right) {
        this.error('Expected right')
      }

      left = {
        type: 'binOp',
        op,
        left,
        right
      }
    }
  }

  protected getOperand () : type.TAst | null {
    return this.getSummand()
  }
}
