import { AstNode } from '../AstNode'

const isWhitespace = (ch: string) => /^[\s\uFEFF\xA0]$/.test(ch)

export class ParserBase {
  protected static convertToIText = (text: string) => text.toUpperCase()

  private readonly source: string
  private readonly iSource: string

  private position = 0

  constructor (source: string) {
    source = source.trim()

    this.source = source
    this.iSource = ParserBase.convertToIText(source)
  }

  protected eof () {
    return this.source.length <= this.position
  }

  protected peek () {
    return this.source.charAt(this.position)
  }

  protected next () {
    this.position++
  }

  protected skip () {
    while (!this.eof() && isWhitespace(this.peek())) {
      this.next()
    }
  }

  protected error (message: string) : never {
    throw new Error(message)
  }

  protected searchIText (...texts: string[]) {
    for (const text of texts) {
      if (this.iSource.startsWith(text, this.position)) {
        this.position += text.length

        this.skip()

        return text
      }
    }

    return null
  }

  protected searchNode (...parsers: (() => AstNode | null)[]) {
    const { position } = this

    for (const parser of parsers) {
      const node: AstNode | null = parser.call(this)

      if (node) {
        return node
      }

      this.position = position
    }

    return null
  }
}
