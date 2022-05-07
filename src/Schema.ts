import { type } from './utils'

export type TSchema = {
  nullable?: boolean
} & ({
  type: 'boolean' | 'number' | 'string'
} | {
  type: 'array',
  items?: TSchema
} | {
  type: 'object',
  properties?: {
    [field: string]: TSchema
  }
})

function isNullable (data: any, schema: TSchema) {
  if (!schema.nullable) {
    return false
  }

  return type.isNull(data)
}

function isBoolean (data: any, schema: TSchema) {
  if (schema.type !== 'boolean') {
    return false
  }

  return type.isBoolean(data)
}

function isNumber (data: any, schema: TSchema) {
  if (schema.type !== 'number') {
    return false
  }

  return type.isNumber(data)
}

function isString (data: any, schema: TSchema) {
  if (schema.type !== 'string') {
    return false
  }

  return type.isString(data)
}

function isArray (data: any, schema: TSchema) {
  if (schema.type !== 'array') {
    return false
  }

  if (!type.isArray(data)) {
    return false
  }

  const schemaItems = schema.items

  if (!schemaItems) {
    return true
  }

  return data.every(
    (item) => verify(item, schemaItems)
  )
}

function isObject (data: any, schema: TSchema) {
  if (schema.type !== 'object') {
    return false
  }

  if (!type.isObject(data)) {
    return false
  }

  const schemaProperties = schema.properties

  if (!schemaProperties) {
    return true
  }

  return Object.entries(schemaProperties).every(
    ([field, fieldSchema]) => verify(data[field], fieldSchema)
  )
}

export function verify (data: any, schema: TSchema): boolean {
  if (isNullable(data, schema)) {
    return true
  }

  return {
    boolean: isBoolean,
    number: isNumber,
    string: isString,
    array: isArray,
    object: isObject
  }[schema.type](data, schema)
}
