import { isDigit } from '../Char'
import {
  iNull,
  iFalse,
  iTrue
} from '../Word'
import {
  TAstValue,
  TAstValueNull,
  TAstValueBoolean,
  TAstValueNumber,
  TAstValueString
} from '../Ast'
import { ParserBase } from './ParserBase'

export class ParserValue extends ParserBase {
  protected readString (sep: string) {
    if (this.peek() !== sep) {
      return null
    }

    this.next()

    let value = ''

    for (; !this.eof() && this.peek() !== sep; this.next()) {
      if (this.peek() === '/') {
        this.next()

        const expected = ['/', sep].includes(this.peek())

        if (!expected) {
          this.error(`Expected [/] or [${sep}]`)
        }
      }

      value += this.peek()
    }

    if (!this.searchIText(sep)) {
      this.error(`Expected '${sep}'`)
    }

    return value
  }

  private getNull = () => {
    if (!this.searchIText(iNull)) {
      return null
    }

    return <TAstValueNull>{
      class: 'value',
      type: 'null'
    }
  }

  private getBoolean = () => {
    const value = this.searchIText(iFalse, iTrue)

    if (!value) {
      return null
    }

    return <TAstValueBoolean>{
      class: 'value',
      type: 'boolean',
      value: value === iTrue
    }
  }

  protected getInteger = () => {
    let value = ''

    for (; isDigit(this.peek()); this.next()) {
      value += this.peek()
    }

    if (!value) {
      return null
    }

    return +value
  }

  private getNumber = () => {
    let value = ''

    const sign = this.searchIText('+', '-')

    if (sign === '-') {
      value += sign
    }

    for (; ;) {
      for (; isDigit(this.peek()); this.next()) {
        value += this.peek()
      }

      if (value.includes('.') || !this.searchIText('.')) {
        break
      }

      value += '.'
    }

    if (['', '-', '.', '-.'].includes(value)) {
      return null
    }

    this.skip()

    return <TAstValueNumber>{
      class: 'value',
      type: 'number',
      value: +value + 0
    }
  }

  private getString = () => {
    const value = this.readString('\'')

    if (value === null) {
      return null
    }

    return <TAstValueString>{
      class: 'value',
      type: 'string',
      value
    }
  }

  protected getValue = () => {
    return this.searchNode<TAstValue>(
      this.getNull,
      this.getBoolean,
      this.getNumber,
      this.getString
    )
  }
}
