import { ParserOperand } from './ParserOperand'
import { AstNode, AstNodeCmpOp, AstNodeBoolOp } from '../AstNode'
import { Char, Word, CmpOp, BoolOp } from '../common'

export class ParserExpression extends ParserOperand {
  private getCmpOperand (left: AstNode) {
    return () => {
      const cmpOp = this.searchIText(CmpOp.Eq, CmpOp.NotEq, CmpOp.LtE, CmpOp.Lt, CmpOp.GtE, CmpOp.Gt)

      if (!cmpOp) {
        return null
      }

      const right = this.getOperand()

      if (!right) {
        this.error('Expected right')
      }

      return new AstNodeCmpOp(cmpOp, [left, right])
    }
  }

  private getInOperands (left: AstNode) {
    return () => {
      const boolNot = this.searchIText(BoolOp.Not)

      const cmpIn = this.searchIText(CmpOp.In)

      if (!cmpIn) {
        return null
      }

      if (!this.searchIText(Char.Lpar)) {
        this.error('Expected lpar')
      }

      const args: AstNode[] = [left]

      do {
        const arg = this.getOperand()

        if (!arg) {
          this.error('Expected arg')
        }

        args.push(arg)
      } while (this.searchIText(Char.Comma))

      if (!this.searchIText(Char.Rpar)) {
        this.error('Expected rpar')
      }

      const cmp = new AstNodeCmpOp(cmpIn, args)

      if (boolNot) {
        return new AstNodeBoolOp(boolNot, [cmp])
      }

      return cmp
    }
  }

  private getLikeOperand (left: AstNode) {
    return () => {
      const boolNot = this.searchIText(BoolOp.Not)
      const cmpLike = this.searchIText(CmpOp.Like)

      if (!cmpLike) {
        return null
      }

      const right = this.getValue()

      if (!right) {
        this.error('Expected right')
      }

      const cmp = new AstNodeCmpOp(cmpLike, [left, right])

      if (boolNot) {
        return new AstNodeBoolOp(boolNot, [cmp])
      }

      return cmp
    }
  }

  private getBetweenOperands (left: AstNode) {
    return () => {
      const boolNot = this.searchIText(BoolOp.Not)
      const cmpBetween = this.searchIText(CmpOp.Between)

      if (!cmpBetween) {
        return null
      }

      const start = this.getOperand()

      if (!start) {
        this.error('Expected start')
      }

      if (!this.searchIText(Word.And)) {
        this.error('Expected AND')
      }

      const end = this.getOperand()

      if (!end) {
        this.error('Expected end')
      }

      const cmp = new AstNodeCmpOp(cmpBetween, [left, start, end])

      if (boolNot) {
        return new AstNodeBoolOp(boolNot, [cmp])
      }

      return cmp
    }
  }

  private getIsNull (left: AstNode) {
    return () => {
      const cmpIs = this.searchIText(CmpOp.Is)

      if (!cmpIs) {
        return null
      }

      const boolNot = this.searchIText(BoolOp.Not)

      if (!this.searchIText(Word.Null)) {
        this.error('Expected NULL')
      }

      const cmp = new AstNodeCmpOp(cmpIs, [left])

      if (boolNot) {
        return new AstNodeBoolOp(boolNot, [cmp])
      }

      return cmp
    }
  }

  private getOperands () {
    const left = this.getOperand()

    if (!left) {
      return null
    }

    return this.searchNode(
      this.getCmpOperand(left),
      this.getInOperands(left),
      this.getLikeOperand(left),
      this.getBetweenOperands(left),
      this.getIsNull(left)
    ) || left
  }

  private getNotExpression () {
    const boolNot = this.searchIText(BoolOp.Not)

    if (!boolNot) {
      return null
    }

    const exp = this.getExpression()

    if (!exp) {
      this.error('Expected expression')
    }

    return new AstNodeBoolOp(boolNot, [exp])
  }

  private getGroupExpression () {
    if (!this.searchIText(Char.Lpar)) {
      return null
    }

    const exp = this.getExpression()

    if (!exp) {
      this.error('Expected expression')
    }

    if (!this.searchIText(Char.Rpar)) {
      throw new Error('Expected rpar')
    }

    return exp
  }

  private getCondition () {
    return this.searchNode(
      this.getOperands,
      this.getNotExpression,
      this.getGroupExpression
    )
  }

  private getAndCondition () {
    let left = this.getCondition()

    if (!left) {
      return null
    }

    for (;;) {
      const boolAnd = this.searchIText(BoolOp.And)

      if (!boolAnd) {
        return left
      }

      const right = this.getCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = new AstNodeBoolOp(boolAnd, [left, right])
    }
  }

  private getOrCondition () {
    let left = this.getAndCondition()

    if (!left) {
      return null
    }

    for (;;) {
      const boolOr = this.searchIText(BoolOp.Or)

      if (!boolOr) {
        return left
      }

      const right = this.getAndCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = new AstNodeBoolOp(boolOr, [left, right])
    }
  }

  protected getExpression () : AstNode | null {
    return this.getOrCondition()
  }
}
