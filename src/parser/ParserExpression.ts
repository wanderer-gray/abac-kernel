import { char, word, cmpOp, boolOp, type } from '../utils'
import { ParserOperand } from './ParserOperand'

export class ParserExpression extends ParserOperand {
  private getCmpOperand (left: type.TAst) {
    return () : type.TAst | null => {
      const op = this.searchIText(
        cmpOp.Eq,
        cmpOp.NotEq,
        cmpOp.LtE,
        cmpOp.Lt,
        cmpOp.GtE,
        cmpOp.Gt
      )

      if (!op || !cmpOp.isSimple(op)) {
        return null
      }

      const right = this.getOperand()

      if (!right) {
        this.error('Expected right')
      }

      return {
        type: 'cmpOp',
        class: 'simple',
        op,
        left,
        right
      }
    }
  }

  private getInOperands (value: type.TAst) {
    return () : type.TAst | null => {
      const boolNot = this.searchIText(boolOp.Not)

      if (!this.searchIText(cmpOp.In)) {
        return null
      }

      if (!this.searchIText(char.Lpar)) {
        this.error('Expected lpar')
      }

      const set: type.TAst[] = []

      do {
        const arg = this.getOperand()

        if (!arg) {
          this.error('Expected arg')
        }

        set.push(arg)
      } while (this.searchIText(char.Comma))

      if (!this.searchIText(char.Rpar)) {
        this.error('Expected rpar')
      }

      const cmp : type.TAst = {
        type: 'cmpOp',
        class: 'complex',
        op: 'in',
        value,
        set
      }

      if (boolNot) {
        return {
          type: 'boolOp',
          op: 'not',
          value: cmp
        }
      }

      return cmp
    }
  }

  private getLikeOperand (value: type.TAst) {
    return () : type.TAst | null => {
      const boolNot = this.searchIText(boolOp.Not)

      if (!this.searchIText(cmpOp.Like)) {
        return null
      }

      const pattern = this.getValue()

      if (!pattern) {
        this.error('Expected pattern')
      }

      const cmp : type.TAst = {
        type: 'cmpOp',
        class: 'complex',
        op: 'like',
        value,
        pattern
      }

      if (boolNot) {
        return {
          type: 'boolOp',
          op: 'not',
          value: cmp
        }
      }

      return cmp
    }
  }

  private getBetweenOperands (value: type.TAst) {
    return () : type.TAst | null => {
      const boolNot = this.searchIText(boolOp.Not)

      if (!this.searchIText(cmpOp.Between)) {
        return null
      }

      const begin = this.getOperand()

      if (!begin) {
        this.error('Expected begin')
      }

      if (!this.searchIText(word.And)) {
        this.error('Expected AND')
      }

      const end = this.getOperand()

      if (!end) {
        this.error('Expected end')
      }

      const cmp : type.TAst = {
        type: 'cmpOp',
        class: 'complex',
        op: 'between',
        value,
        begin,
        end
      }

      if (boolNot) {
        return {
          type: 'boolOp',
          op: 'not',
          value: cmp
        }
      }

      return cmp
    }
  }

  private getIsNull (value: type.TAst) {
    return () : type.TAst | null => {
      if (!this.searchIText(cmpOp.Is)) {
        return null
      }

      const boolNot = this.searchIText(boolOp.Not)

      if (!this.searchIText(word.Null)) {
        this.error('Expected NULL')
      }

      const cmp : type.TAst = {
        type: 'cmpOp',
        class: 'complex',
        op: 'is',
        value
      }

      if (boolNot) {
        return {
          type: 'boolOp',
          op: 'not',
          value: cmp
        }
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
    )
  }

  private getNotExpression () : type.TAst | null {
    if (!this.searchIText(boolOp.Not)) {
      return null
    }

    const value = this.getExpression()

    if (!value) {
      this.error('Expected value')
    }

    return {
      type: 'boolOp',
      op: 'not',
      value
    }
  }

  private getGroupExpression () {
    if (!this.searchIText(char.Lpar)) {
      return null
    }

    const expression = this.getExpression()

    if (!expression) {
      this.error('Expected expression')
    }

    if (!this.searchIText(char.Rpar)) {
      throw new Error('Expected rpar')
    }

    return expression
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
      if (!this.searchIText(boolOp.And)) {
        return left
      }

      const right = this.getCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = {
        type: 'boolOp',
        op: 'and',
        left,
        right
      }
    }
  }

  private getOrCondition () {
    let left = this.getAndCondition()

    if (!left) {
      return null
    }

    for (;;) {
      if (!this.searchIText(boolOp.Or)) {
        return left
      }

      const right = this.getAndCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = {
        type: 'boolOp',
        op: 'or',
        left,
        right
      }
    }
  }

  protected getExpression () : type.TAst | null {
    return this.getOrCondition()
  }
}
