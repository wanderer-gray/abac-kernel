import { type } from './utils'

type TName = type.TString

export class PolicySet {
  readonly name: TName

  constructor ({
    name
  }: {
    name: TName
  }) {
    this.name = name
  }
}
