import { isLetter, isLetterOrDigit } from '../Char'
import {
  TAst,
  TAstAttribute,
  TAstFunction,
  TAstOpBin
} from '../Ast'
import { ParserValue } from './ParserValue'

export class ParserOperand extends ParserValue {
  private getBind () {
    if (!isLetter(this.peek())) {
      return null
    }

    let name = ''

    for (; isLetterOrDigit(this.peek()); this.next()) {
      name += this.peek()
    }

    this.skip()

    return name
  }

  private getAttribute = () => {
    const name = this.getBind()

    if (!name || this.searchIText('(')) {
      return null
    }

    return <TAstAttribute>{
      class: 'attribute',
      name
    }
  }

  private getFunction = () => {
    const name = this.getBind()

    if (!name || !this.searchIText('(')) {
      return null
    }

    const args: TAst[] = []

    let arg = this.getOperand()

    while (arg) {
      args.push(arg)

      if (!this.searchIText(',')) {
        break
      }

      arg = this.getOperand()

      if (!arg) {
        this.error('Expected arg')
      }
    }

    if (!this.searchIText(')')) {
      this.error('Expected rpar')
    }

    return <TAstFunction>{
      class: 'function',
      name,
      args
    }
  }

  private getGroup = () => {
    if (!this.searchIText('(')) {
      return null
    }

    const operand = this.getOperand()

    if (!operand) {
      this.error('Expected operand')
    }

    if (!this.searchIText(')')) {
      this.error('Expected rpar')
    }

    return operand
  }

  private getTerm () {
    return this.searchNode(
      this.getValue,
      this.getAttribute,
      this.getFunction,
      this.getGroup
    )
  }

  private getFactor () {
    let left = this.getTerm()

    if (!left) {
      return null
    }

    for (; ;) {
      const op = this.searchIText(
        '//',
        '*',
        '/',
        '%'
      )

      if (!op) {
        return left
      }

      const right = this.getTerm()

      if (!right) {
        this.error('Expected right')
      }

      left = <TAstOpBin>{
        class: 'op',
        type: 'bin',
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

    for (; ;) {
      const op = this.searchIText('+', '-')

      if (!op) {
        return left
      }

      const right = this.getFactor()

      if (!right) {
        this.error('Expected right')
      }

      left = <TAstOpBin>{
        class: 'op',
        type: 'bin',
        op,
        left,
        right
      }
    }
  }

  protected getOperand (): TAst | null {
    return this.getSummand()
  }
}
