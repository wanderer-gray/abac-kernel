import { Parser } from '../../src/vm/parser'
import { makeAstNull, makeAstBool, makeAstNum, makeAstStr, makeAstAttr, makeAstFunc, makeAstBin } from './make'

test('empty', () => {
  expect(() => Parser.Parse('')).toThrowError(new Error('Expected expression'))
})

test('whitespace', () => {
  expect(() => Parser.Parse(' ')).toThrowError(new Error('Expected expression'))
})

test('value null', () => {
  expect(Parser.Parse('null')).toStrictEqual(makeAstNull())
  expect(Parser.Parse('NULL')).toStrictEqual(makeAstNull())
})

test('value bool', () => {
  expect(Parser.Parse('true')).toStrictEqual(makeAstBool(true))
  expect(Parser.Parse('TRUE')).toStrictEqual(makeAstBool(true))
  expect(Parser.Parse('false')).toStrictEqual(makeAstBool(false))
  expect(Parser.Parse('FALSE')).toStrictEqual(makeAstBool(false))
})

test('value num', () => {
  expect(Parser.Parse('1')).toStrictEqual(makeAstNum(1))
  expect(Parser.Parse('1.')).toStrictEqual(makeAstNum(1))
  expect(Parser.Parse('.1')).toStrictEqual(makeAstNum(0.1))
  expect(Parser.Parse('1.2')).toStrictEqual(makeAstNum(1.2))
})

test('value str', () => {
  expect(Parser.Parse("''")).toStrictEqual(makeAstStr(''))
  expect(Parser.Parse("''''")).toStrictEqual(makeAstStr("'"))
  expect(Parser.Parse("'Hello, World!'")).toStrictEqual(makeAstStr('Hello, World!'))
})

test('value attr', () => {
  expect(Parser.Parse('a')).toStrictEqual(makeAstAttr('a'))
  expect(Parser.Parse('aBc123')).toStrictEqual(makeAstAttr('aBc123'))
})

test('value func', () => {
  expect(Parser.Parse('a()')).toStrictEqual(makeAstFunc('a', []))
  expect(Parser.Parse("aBc123(null, false, 1, 'Hello, World!', a, a())")).toStrictEqual(
    makeAstFunc('aBc123', [
      makeAstNull(),
      makeAstBool(false),
      makeAstNum(1),
      makeAstStr('Hello, World!'),
      makeAstAttr('a'),
      makeAstFunc('a', [])
    ])
  )
})

test('group', () => {
  expect(Parser.Parse('(null)')).toStrictEqual(makeAstNull())
  expect(Parser.Parse('(true)')).toStrictEqual(makeAstBool(true))
  expect(Parser.Parse('(1234)')).toStrictEqual(makeAstNum(1234))
  expect(Parser.Parse("('Hello, World!')")).toStrictEqual(makeAstStr('Hello, World!'))
  expect(Parser.Parse('(a)')).toStrictEqual(makeAstAttr('a'))
  expect(Parser.Parse('(a())')).toStrictEqual(makeAstFunc('a', []))
})

test('factor', () => {
  expect(Parser.Parse('1 * 2')).toStrictEqual(
    makeAstBin('*',
      makeAstNum(1),
      makeAstNum(2)
    )
  )
  expect(Parser.Parse('2 / 3')).toStrictEqual(
    makeAstBin('/',
      makeAstNum(2),
      makeAstNum(3)
    )
  )
  expect(Parser.Parse('3 % 4')).toStrictEqual(
    makeAstBin('%',
      makeAstNum(3),
      makeAstNum(4)
    )
  )
  expect(Parser.Parse('4 // 5')).toStrictEqual(
    makeAstBin('//',
      makeAstNum(4),
      makeAstNum(5)
    )
  )
  expect(Parser.Parse('1 * a * 3')).toStrictEqual(
    makeAstBin('*',
      makeAstBin('*',
        makeAstNum(1),
        makeAstAttr('a')
      ),
      makeAstNum(3)
    )
  )
  expect(Parser.Parse('1 * (a // 3)')).toStrictEqual(
    makeAstBin('*',
      makeAstNum(1),
      makeAstBin('//',
        makeAstAttr('a'),
        makeAstNum(3)
      )
    )
  )
})

test('summand', () => {
  expect(Parser.Parse('1 + 2')).toStrictEqual(
    makeAstBin('+',
      makeAstNum(1),
      makeAstNum(2)
    )
  )
  expect(Parser.Parse('2 - 3')).toStrictEqual(
    makeAstBin('-',
      makeAstNum(2),
      makeAstNum(3)
    )
  )
  expect(Parser.Parse('3 - 4 * 5')).toStrictEqual(
    makeAstBin('-',
      makeAstNum(3),
      makeAstBin('*',
        makeAstNum(4),
        makeAstNum(5)
      )
    )
  )
  expect(Parser.Parse('4 - 5 * 6 + 7')).toStrictEqual(
    makeAstBin('+',
      makeAstBin('-',
        makeAstNum(4),
        makeAstBin('*',
          makeAstNum(5),
          makeAstNum(6)
        )
      ),
      makeAstNum(7)
    )
  )
})

test('cmp', () => {

})
