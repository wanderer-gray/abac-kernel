type TSupport = null | boolean | number | string | TSupport[] | { [field: string]: TSupport }

type TNull = null

type TBoolean = boolean

type TNumber = number

type TString = string

type TArray<TItem = TSupport> = TItem[]

type TObject<TFieldValue = TSupport> = { [field: string]: TFieldValue }

function isSupport (value: any): value is TSupport {
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

function isNull (value: any): value is TNull {
  return value === null
}

function isBoolean (value: any): value is TBoolean {
  return typeof value === 'boolean'
}

function isNumber (value: any): value is TNumber {
  if (typeof value !== 'number') {
    return false
  }

  return Number.isFinite(value)
}

function isString (value: any): value is TString {
  return typeof value === 'string'
}

function isArray (value: any): value is TArray {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every(isSupport)
}

function isObject (value: any): value is TObject {
  if (typeof value !== 'object') {
    return false
  }

  if (value === null) {
    return false
  }

  if (isArray(value)) {
    return false
  }

  return Object.entries(value).every(([field, fieldValue]) => {
    if (!isString(field)) {
      return false
    }

    return isSupport(fieldValue)
  })
}

function error (message: string) : never {
  throw new Error(message)
}

function assertIsSupport (value: any, message: string = 'Value is not a Support') {
  if (!isSupport(value)) {
    error(message)
  }

  return value
}

function assertIsNull (value: any, message: string = 'Value is not a Null') {
  if (!isNull(value)) {
    error(message)
  }

  return value
}

function assertIsBoolean (value: any, message: string = 'Value is not a Boolean') {
  if (!isBoolean(value)) {
    error(message)
  }

  return value
}

function assertIsNumber (value: any, message: string = 'Value is not a Number') {
  if (!isNumber(value)) {
    error(message)
  }

  return value
}

function assertIsString (value: any, message: string = 'Value is not a String') {
  if (!isString(value)) {
    error(message)
  }

  return value
}

function assertIsArray (value: any, message: string = 'Value is not a Array') {
  if (!isArray(value)) {
    error(message)
  }

  return value
}

function assertIsObject (value: any, message: string = 'Value is not a Object') {
  if (!isObject(value)) {
    error(message)
  }

  return value
}

export {
  TSupport,
  TNull,
  TBoolean,
  TNumber,
  TString,
  TArray,
  TObject,
  isSupport,
  isNull,
  isBoolean,
  isNumber,
  isString,
  isArray,
  isObject,
  assertIsSupport,
  assertIsNull,
  assertIsBoolean,
  assertIsNumber,
  assertIsString,
  assertIsArray,
  assertIsObject
}
