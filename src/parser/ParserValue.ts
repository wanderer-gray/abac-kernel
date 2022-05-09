import { isDigit } from '../Char'
import {
  iNull,
  iFalse,
  iTrue
} from '../Word'
import {
  TAstValueNull,
  TAstValueBoolean,
  TAstValueNumber,
  TAstValueString
} from '../Ast'
import { ParserBase } from './ParserBase'

export class ParserValue extends ParserBase {
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

  private getNumber = () => {
    let value = ''

    for (; ;) {
      for (; isDigit(this.peek()); this.next()) {
        value += this.peek()
      }

      if (value.includes('.') || !this.searchIText('.')) {
        break
      }

      value += '.'
    }

    if (!value || value === '.') {
      return null
    }

    return <TAstValueNumber>{
      class: 'value',
      type: 'number',
      value: +value
    }
  }

  private getString = () => {
    if (!this.searchIText('\'')) {
      return null
    }

    let value = ''

    for (; ;) {
      for (; !this.eof() && this.peek() !== '\''; this.next()) {
        value += this.peek()
      }

      if (!this.searchIText('\''.repeat(2))) {
        break
      }

      value += '\''
    }

    if (!this.searchIText('\'')) {
      this.error('Expected apos')
    }

    this.skip()

    return <TAstValueString>{
      class: 'value',
      type: 'string',
      value
    }
  }

  protected getValue = () => {
    return this.searchNode(
      this.getNull,
      this.getBoolean,
      this.getNumber,
      this.getString
    )
  }
}
