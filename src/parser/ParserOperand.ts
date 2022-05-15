import { isLetter, isLetterOrDigit } from '../Char'
import {
  TAst,
  TAstAttribute,
  TAstFunction,
  TAstProp,
  TAstPropGet,
  TAstPropIndex,
  TAstOpBin
} from '../Ast'
import { ParserValue } from './ParserValue'

export class ParserOperand extends ParserValue {
  private getNameQuot = () => {
    return this.readString('"')
  }

  private getNameLetter = () => {
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

  private getName () {
    return this.searchNode(
      this.getNameQuot,
      this.getNameLetter
    )
  }

  private getAttribute = () => {
    const name = this.getName()

    if (!name || this.searchIText('(')) {
      return null
    }

    return <TAstAttribute>{
      class: 'attribute',
      name
    }
  }

  private getFunction = () => {
    const name = this.getName()

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

  private getPropGet = (value: TAst) => {
    return () => {
      if (!this.searchIText('.')) {
        return null
      }

      const name = this.getName()

      if (!name) {
        this.error('Expected prop name')
      }

      return <TAstPropGet>{
        class: 'prop',
        type: 'get',
        name,
        value
      }
    }
  }

  private getPropIndex = (value: TAst) => {
    return () => {
      if (!this.searchIText('[')) {
        return null
      }

      const index = this.getInteger()

      if (index === null) {
        this.error('Expected prop index')
      }

      if (!this.searchIText(']')) {
        this.error('Expected rbrack')
      }

      return <TAstPropIndex>{
        class: 'prop',
        type: 'index',
        index,
        value
      }
    }
  }

  private getProp = (value: TAst) => {
    return this.searchNode<TAstProp>(
      this.getPropGet(value),
      this.getPropIndex(value)
    )
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
    let value = this.searchNode(
      this.getValue,
      this.getAttribute,
      this.getFunction,
      this.getGroup
    )

    if (!value) {
      return null
    }

    for (;;) {
      const prop = this.getProp(value)

      if (!prop) {
        return value
      }

      value = prop
    }
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
