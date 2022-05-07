import { ParserBase } from './ParserBase'
import { AstNodeNull, AstNodeBool, AstNodeNum, AstNodeStr } from '../AstNode'
import { Char, Word } from '../common'

const isDigit = (ch: string) => /^[0-9]$/.test(ch)

export class ParserValue extends ParserBase {
  private getNull () {
    if (this.searchIText(Word.Null)) {
      return new AstNodeNull()
    }

    return null
  }

  private getBool () {
    const bool = this.searchIText(Word.False, Word.True)

    if (bool) {
      return new AstNodeBool(bool === Word.True)
    }

    return null
  }

  private getNum () {
    let num = ''

    for (;;) {
      for (; isDigit(this.peek()); this.next()) {
        num += this.peek()
      }

      if (num.includes(Char.Dot) || !this.searchIText(Char.Dot)) {
        break
      }

      num += Char.Dot
    }

    if (num) {
      this.skip()

      return new AstNodeNum(parseFloat(num))
    }

    return null
  }

  private getStr () {
    if (!this.searchIText(Char.Apos)) {
      return null
    }

    let str = ''

    for (;;) {
      for (; !this.eof() && this.peek() !== Char.Apos; this.next()) {
        str += this.peek()
      }

      if (!this.searchIText(Char.Apos.repeat(2))) {
        break
      }

      str += Char.Apos
    }

    if (!this.searchIText(Char.Apos)) {
      this.error('Expected apos')
    }

    this.skip()

    return new AstNodeStr(str)
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
