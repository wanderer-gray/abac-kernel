type TObject<TValue> = {[key: string]: TValue}

export type TChecker = (value: any) => boolean

type TObjectChecker = TObject<TChecker>

const checkObjectStruct = (value: TObject<any>, objectChecker: TObjectChecker) =>
  Object.entries(objectChecker).every(
    ([field, checker]) =>
      field in value &&
      checker(value[field])
  )

export class TypeChecker {
  static get null () {
    return (value: any): value is null => value === null
  }

  static get bool () {
    return (value: any): value is boolean => typeof value === 'boolean'
  }

  static get num () {
    return (value: any): value is number => Number.isFinite(value)
  }

  static get str () {
    return (value: any): value is string => typeof value === 'string'
  }

  static get array () {
    return (value: any): value is any[] => Array.isArray(value)
  }

  static get object () {
    return (value: any): value is TObject<any> => typeof value === 'object' && !this.null(value) && !this.array(value)
  }

  static get any () {
    return this.oneOfType([
      this.null,
      this.bool,
      this.num,
      this.str,
      this.array,
      this.object
    ])
  }

  static arrayOf (checker: TChecker) {
    return (value: any) => this.array(value) && value.every(checker)
  }

  static objectOf (checker: TChecker) {
    return (value: any) => this.object(value) && this.arrayOf(checker)(Object.values(value))
  }

  static shape (objectChecker: TObjectChecker) {
    return (value: any): value is TObject<any> => this.object(value) && checkObjectStruct(value, objectChecker)
  }

  static exact (objectChecker: TObjectChecker) {
    return (value: any) => this.shape(objectChecker)(value) && Object.keys(value).length === Object.keys(objectChecker).length
  }

  static oneOf (values: any[]) {
    return (value: any) => values.includes(value)
  }

  static oneOfType (checkers: TChecker[]) {
    return (value: any) => checkers.some((checker) => checker(value))
  }
}
