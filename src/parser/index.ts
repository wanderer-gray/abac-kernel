import { ParserExpression } from './ParserExpression'

export class Parser extends ParserExpression {
  Parse () {
    const ast = this.getExpression()

    if (!ast) {
      this.error('Expected ast')
    }

    if (!this.eof()) {
      this.error('Expected EOF')
    }

    return ast
  }

  static Parse (source: string) {
    return new Parser(source).Parse()
  }
}
