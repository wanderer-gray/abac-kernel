import { Parser } from '../src/Parser'

test('source empty', () => {
  expect(() => Parser.Parse('')).toThrowError(new Error('Parser: Expected ast'))
})

test('value null', () => {
  expect(Parser.Parse('null')).toEqual({
    class: 'value',
    type: 'null'
  })
})

test('value boolean true', () => {
  expect(Parser.Parse('true')).toEqual({
    class: 'value',
    type: 'boolean',
    value: true
  })
})

test('value boolean false', () => {
  expect(Parser.Parse('false')).toEqual({
    class: 'value',
    type: 'boolean',
    value: false
  })
})

test('value number +', () => {
  expect(() => Parser.Parse('+')).toThrowError(new Error('Parser: Expected ast'))
})

test('value number -', () => {
  expect(() => Parser.Parse('-')).toThrowError(new Error('Parser: Expected ast'))
})

test('value number .', () => {
  expect(() => Parser.Parse('.')).toThrowError(new Error('Parser: Expected ast'))
})

test('value number +.', () => {
  expect(() => Parser.Parse('+.')).toThrowError(new Error('Parser: Expected ast'))
})

test('value number -.', () => {
  expect(() => Parser.Parse('-.')).toThrowError(new Error('Parser: Expected ast'))
})

test('value number 0', () => {
  expect(Parser.Parse('0')).toEqual({
    class: 'value',
    type: 'number',
    value: 0
  })
})

test('value number -0', () => {
  expect(Parser.Parse('-0')).toEqual({
    class: 'value',
    type: 'number',
    value: 0
  })
})

test('value number +0', () => {
  expect(Parser.Parse('+0')).toEqual({
    class: 'value',
    type: 'number',
    value: 0
  })
})

test('value number -123', () => {
  expect(Parser.Parse('-123')).toEqual({
    class: 'value',
    type: 'number',
    value: -123
  })
})

test('value number +123', () => {
  expect(Parser.Parse('123')).toEqual({
    class: 'value',
    type: 'number',
    value: 123
  })
})

test('value number -123.', () => {
  expect(Parser.Parse('-123.')).toEqual({
    class: 'value',
    type: 'number',
    value: -123
  })
})

test('value number 123.', () => {
  expect(Parser.Parse('123.')).toEqual({
    class: 'value',
    type: 'number',
    value: 123
  })
})

test('value number -123.321', () => {
  expect(Parser.Parse('-123.321')).toEqual({
    class: 'value',
    type: 'number',
    value: -123.321
  })
})

test('value number 123.321', () => {
  expect(Parser.Parse('123.321')).toEqual({
    class: 'value',
    type: 'number',
    value: 123.321
  })
})

test('value string empty', () => {
  expect(Parser.Parse('\'\'')).toEqual({
    class: 'value',
    type: 'string',
    value: ''
  })
})

test('value string "Hello, World!"', () => {
  expect(Parser.Parse('\'Hello, World!\'')).toEqual({
    class: 'value',
    type: 'string',
    value: 'Hello, World!'
  })
})

test('value string bad escape', () => {
  expect(() => Parser.Parse('\'Special char [/]\'')).toThrowError(new Error('Parser: Expected [/] or [\']'))
})

test('value string escape "Special char [\']', () => {
  expect(Parser.Parse('\'Special char [/\']\'')).toEqual({
    class: 'value',
    type: 'string',
    value: 'Special char [\']'
  })
})

test('value string escape "Special char [/]', () => {
  expect(Parser.Parse('\'Special char [//]\'')).toEqual({
    class: 'value',
    type: 'string',
    value: 'Special char [/]'
  })
})

test('attribute "my_attr"', () => {
  expect(Parser.Parse('my_attr')).toEqual({
    class: 'attribute',
    name: 'my_attr'
  })
})

test('attribute not support "Мой атрибут"', () => {
  expect(() => Parser.Parse('Мой атрибут')).toThrowError(new Error('Parser: Expected ast'))
})

test('attribute support "Мой атрибут"', () => {
  expect(Parser.Parse('"Мой атрибут"')).toEqual({
    class: 'attribute',
    name: 'Мой атрибут'
  })
})
