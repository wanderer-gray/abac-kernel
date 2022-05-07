export type TNull = null

export type TBoolean = boolean

export type TNumber = number

export type TString = string

export type TSupport = TNull | TBoolean | TNumber | TSupport[] | { [key: string]: TSupport }

export type TArray<TItem = TSupport> = TItem[]

export type TObject<TValue = TSupport> = { [key: string]: TValue }

export function isNull (value: any): value is TNull {
  return value === null
}

export function isBoolean (value: any): value is TBoolean {
  return typeof value === 'boolean'
}

export function isNumber (value: any): value is TNumber {
  if (typeof value !== 'number') {
    return false
  }

  return Number.isFinite(value)
}

export function isString (value: any): value is TString {
  return typeof value === 'string'
}

export function isArray (value: any): value is TArray {
  return Array.isArray(value)
}

export function isObject (value: any): value is TObject {
  if (typeof value !== 'object') {
    return false
  }

  if (value === null) {
    return false
  }

  if (isArray(value)) {
    return false
  }

  return Object.keys(value).every(isString)
}

export function isSupport (value: any): value is TSupport {
  if (isNull(value)) {
    return true
  }

  if (isBoolean(value)) {
    return true
  }

  if (isNumber(value)) {
    return true
  }

  if (isString(value)) {
    return true
  }

  if (isArray(value)) {
    return true
  }

  if (isObject(value)) {
    return true
  }

  return false
}
