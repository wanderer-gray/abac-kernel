export const enum AstType {
  Null,
  Bool,
  Num,
  Str,
  Attr,
  Func,
  BinOp,
  CmpOp,
  BoolOp
}

export class AstNode {
  readonly type: AstType

  constructor (type: AstType) {
    this.type = type
  }
}

export class AstNodeValue<TValue> extends AstNode {
  readonly value: TValue

  constructor (type: AstType, value: TValue) {
    super(type)

    this.value = value
  }
}

export class AstNodeNull extends AstNodeValue<null> {
  constructor () {
    super(AstType.Null, null)
  }
}

export class AstNodeBool extends AstNodeValue<boolean> {
  constructor (value: boolean) {
    super(AstType.Bool, value)
  }
}

export class AstNodeNum extends AstNodeValue<number> {
  constructor (value: number) {
    super(AstType.Num, value)
  }
}

export class AstNodeStr extends AstNodeValue<string> {
  constructor (value: string) {
    super(AstType.Str, value)
  }
}

export class AstNodeBind extends AstNode {
  readonly name: string

  constructor (type: AstType, name: string) {
    super(type)

    this.name = name
  }
}

export class AstNodeAttr extends AstNodeBind {
  constructor (name: string) {
    super(AstType.Attr, name)
  }
}

export class AstNodeFunc extends AstNodeBind {
  readonly args: AstNode[]

  constructor (name: string, args: AstNode[] = []) {
    super(AstType.Func, name)

    this.args = args
  }
}

export class AstNodeOp extends AstNode {
  readonly op: string
  readonly childs: AstNode[]

  constructor (type: AstType, op: string, childs: AstNode[] = []) {
    super(type)

    this.op = op
    this.childs = childs
  }
}

export class AstNodeBinOp extends AstNodeOp {
  constructor (op: string, childs: AstNode[] = []) {
    super(AstType.BinOp, op, childs)
  }
}

export class AstNodeCmpOp extends AstNodeOp {
  constructor (op: string, childs: AstNode[] = []) {
    super(AstType.CmpOp, op, childs)
  }
}

export class AstNodeBoolOp extends AstNodeOp {
  constructor (op: string, childs: AstNode[] = []) {
    super(AstType.BoolOp, op, childs)
  }
}
