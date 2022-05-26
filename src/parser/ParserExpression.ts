import {
  iNull,
  iNot,
  iAnd,
  iOr,
  iIn,
  iLike,
  iBetween,
  iIs
} from '../Word'
import {
  TAst,
  TAstOp,
  TAstOpCmp,
  TAstOpIn,
  TAstOpLike,
  TAstOpBetween,
  TAstOpIs,
  TAstOpBoolNot,
  TAstOpBoolAnd,
  TAstOpBoolOr
} from '../Ast'
import { ParserOperand } from './ParserOperand'

export class ParserExpression extends ParserOperand {
  private getCmpOperand = (left: TAst) => {
    return () => {
      const op = this.searchIText(
        '==',
        '!=',
        '<=',
        '<',
        '>=',
        '>'
      )

      if (!op) {
        return null
      }

      const right = this.getOperand()

      if (!right) {
        this.error('Expected right')
      }

      return <TAstOpCmp>{
        class: 'op',
        type: 'cmp',
        op,
        left,
        right
      }
    }
  }

  private getInOperands = (value: TAst) => {
    return () => {
      const boolNot = this.searchIText(iNot)

      if (!this.searchIText(iIn)) {
        return null
      }

      if (!this.searchIText('(')) {
        this.error('Expected lpar')
      }

      const set: TAst[] = []

      do {
        const arg = this.getOperand()

        if (!arg) {
          this.error('Expected arg')
        }

        set.push(arg)
      } while (this.searchIText(','))

      if (!this.searchIText(')')) {
        this.error('Expected rpar')
      }

      const opIn = <TAstOpIn>{
        class: 'op',
        type: 'in',
        value,
        set
      }

      if (boolNot) {
        return <TAstOpBoolNot>{
          class: 'op',
          type: 'bool',
          op: 'not',
          value: opIn
        }
      }

      return opIn
    }
  }

  private getLikeOperand = (value: TAst) => {
    return () => {
      const boolNot = this.searchIText(iNot)

      if (!this.searchIText(iLike)) {
        return null
      }

      const pattern = this.getValue()

      if (!pattern) {
        this.error('Expected pattern')
      }

      const opLike = <TAstOpLike>{
        class: 'op',
        type: 'like',
        value,
        pattern
      }

      if (boolNot) {
        return <TAstOpBoolNot>{
          class: 'op',
          type: 'bool',
          op: 'not',
          value: opLike
        }
      }

      return opLike
    }
  }

  private getBetweenOperands = (value: TAst) => {
    return () => {
      const boolNot = this.searchIText(iNot)

      if (!this.searchIText(iBetween)) {
        return null
      }

      const begin = this.getOperand()

      if (!begin) {
        this.error('Expected begin')
      }

      if (!this.searchIText(iAnd)) {
        this.error('Expected AND')
      }

      const end = this.getOperand()

      if (!end) {
        this.error('Expected end')
      }

      const opBetween = <TAstOpBetween>{
        class: 'op',
        type: 'between',
        value,
        begin,
        end
      }

      if (boolNot) {
        return <TAstOpBoolNot>{
          class: 'op',
          type: 'bool',
          op: 'not',
          value: opBetween
        }
      }

      return opBetween
    }
  }

  private getIsNull = (value: TAst) => {
    return () => {
      if (!this.searchIText(iIs)) {
        return null
      }

      const boolNot = this.searchIText(iNot)

      if (!this.searchIText(iNull)) {
        this.error('Expected NULL')
      }

      const opIs = <TAstOpIs>{
        class: 'op',
        type: 'is',
        value
      }

      if (boolNot) {
        return <TAstOpBoolNot>{
          class: 'op',
          type: 'bool',
          op: 'not',
          value: opIs
        }
      }

      return opIs
    }
  }

  private getOperands = () => {
    const left = this.getOperand()

    if (!left) {
      return null
    }

    const operands = this.searchNode<TAstOp>(
      this.getCmpOperand(left),
      this.getInOperands(left),
      this.getLikeOperand(left),
      this.getBetweenOperands(left),
      this.getIsNull(left)
    )

    if (operands) {
      return operands
    }

    return left
  }

  private getNotExpression = () => {
    if (!this.searchIText(iNot)) {
      return null
    }

    const value = this.getExpression()

    if (!value) {
      this.error('Expected value')
    }

    return <TAstOpBoolNot>{
      class: 'op',
      type: 'bool',
      op: 'not',
      value
    }
  }

  private getGroupExpression = () => {
    if (!this.searchIText('(')) {
      return null
    }

    const expression = this.getExpression()

    if (!expression) {
      this.error('Expected expression')
    }

    if (!this.searchIText(')')) {
      throw new Error('Expected rpar')
    }

    return expression
  }

  private getCondition () {
    return this.searchNode(
      this.getNotExpression,
      this.getGroupExpression,
      this.getOperands
    )
  }

  private getAndCondition () {
    let left = this.getCondition()

    if (!left) {
      return null
    }

    for (; ;) {
      if (!this.searchIText(iAnd)) {
        return left
      }

      const right = this.getCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = <TAstOpBoolAnd>{
        class: 'op',
        type: 'bool',
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

    for (; ;) {
      if (!this.searchIText(iOr)) {
        return left
      }

      const right = this.getAndCondition()

      if (!right) {
        this.error('Expected right')
      }

      left = <TAstOpBoolOr>{
        class: 'op',
        type: 'bool',
        op: 'or',
        left,
        right
      }
    }
  }

  protected getExpression (): TAst | null {
    return this.getOrCondition()
  }
}
