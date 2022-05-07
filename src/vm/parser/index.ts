import { ParserExpression } from './ParserExpression'

export class Parser extends ParserExpression {
  Parse () {
    const expression = this.getExpression()

    if (!expression) {
      this.error('Expected expression')
    }

    if (!this.eof()) {
      this.error('Expected EOF')
    }

    return expression
  }

  static Parse (source: string) {
    return new Parser(source).Parse()
  }
}
