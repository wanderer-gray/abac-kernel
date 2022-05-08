import { char, word, type } from '../utils'
import { ParserBase } from './ParserBase'

export class ParserValue extends ParserBase {
  private getNull () : type.TAst | null {
    if (!this.searchIText(word.Null)) {
      return null
    }

    return {
      type: 'null'
    }
  }

  private getBool () : type.TAst | null {
    const value = this.searchIText(word.False, word.True)

    if (!value) {
      return null
    }

    return {
      type: 'bool',
      value: value === word.True
    }
  }

  private getNum () : type.TAst | null {
    let value = ''

    for (;;) {
      for (; char.isDigit(this.peek()); this.next()) {
        value += this.peek()
      }

      if (value.includes(char.Dot) || !this.searchIText(char.Dot)) {
        break
      }

      value += char.Dot
    }

    if (!value || value === char.Dot) {
      return null
    }

    return {
      type: 'num',
      value: +value
    }
  }

  private getStr () : type.TAst | null {
    if (!this.searchIText(char.Apos)) {
      return null
    }

    let value = ''

    for (;;) {
      for (; !this.eof() && this.peek() !== char.Apos; this.next()) {
        value += this.peek()
      }

      if (!this.searchIText(char.Apos.repeat(2))) {
        break
      }

      value += char.Apos
    }

    if (!this.searchIText(char.Apos)) {
      this.error('Expected apos')
    }

    this.skip()

    return {
      type: 'str',
      value
    }
  }

  protected getValue () {
    return this.searchNode(
      this.getNull,
      this.getBool,
      this.getNum,
      this.getStr
    )
  }
}
