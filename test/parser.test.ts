import { Parser } from '../src/Parser'

test('source: empty', () => {
  expect(() => Parser.Parse('')).toThrowError(new Error('Parser: Expected ast'))
})
