import { char, word, type } from '../utils'

export class ParserBase {
  private readonly source: string
  private readonly iSource: string

  private position = 0

  constructor (source: string) {
    source = source.trim()

    this.source = source
    this.iSource = word.convertToIText(source)
  }

  protected error (message: string) : never {
    throw new Error(`Parser: ${message}`)
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
    while (!this.eof() && char.isWhitespace(this.peek())) {
      this.next()
    }
  }

  protected searchIText (...iTexts: string[]) {
    for (const iText of iTexts) {
      if (this.iSource.startsWith(iText, this.position)) {
        this.position += iText.length

        this.skip()

        return iText
      }
    }

    return null
  }

  protected searchNode (...parsers: (() => type.TAst | null)[]) {
    const { position: startPosition } = this

    for (const parser of parsers) {
      const node = parser.call(this)

      if (node) {
        return node
      }

      this.position = startPosition
    }

    return null
  }
}
