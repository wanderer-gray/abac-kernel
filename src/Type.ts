// TypeChecker

type Common<Type> = {
  type: Type,
  nullable?: boolean
}
type Simple = Common<'bool' | 'num' | 'str'>
type Array = Common<'array'>
type ArrayOf = Array & {items: Any}
type ArrayStrict = Array & {pattern: Any[]}
type Object = Common<'object'>
type ObjectOf = Object & {values: Any}
type ObjectStrict = Object & {properties: {[key: string]: Any}}

export type Any = Simple | ArrayOf | ArrayStrict | ObjectOf | ObjectStrict
