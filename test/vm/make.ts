import {
  AstNodeNull,
  AstNodeBool,
  AstNodeNum,
  AstNodeStr,
  AstNodeAttr,
  AstNodeFunc,
  AstNodeBinOp
} from '../../src/vm/AstNode'

export const makeAstNull = () => {
  const result = new AstNodeNull()

  expect(result).toEqual({
    type: 0,
    value: null
  })

  return result
}

export const makeAstBool = (value: boolean) => {
  const result = new AstNodeBool(value)

  expect(result).toEqual({
    type: 1,
    value
  })

  return result
}

export const makeAstNum = (value: number) => {
  const result = new AstNodeNum(value)

  expect(result).toEqual({
    type: 2,
    value
  })

  return result
}

export const makeAstStr = (value: string) => {
  const result = new AstNodeStr(value)

  expect(result).toEqual({
    type: 3,
    value
  })

  return result
}

export const makeAstAttr = (name: string) => {
  const result = new AstNodeAttr(name)

  expect(result).toEqual({
    type: 4,
    name
  })

  return result
}

export const makeAstFunc = (name: string, args: any[]) => {
  const result = new AstNodeFunc(name, args)

  expect(result).toEqual({
    type: 5,
    name,
    args
  })

  return result
}

export const makeAstBin = (op: string, left: any, right: any) => {
  const result = new AstNodeBinOp(op, [left, right])

  expect(result).toEqual({
    type: 6,
    op,
    childs: [left, right]
  })

  return result
}
