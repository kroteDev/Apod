export class NotFoundError extends Error {
  
  readonly name = 'NotFoundError'

  constructor(    
    readonly identifier: string    
  ) {
    super()
  }

  get message(): string {
    return `${this.identifier}`
  }
}

export class RequiredFieldsError extends Error {

  readonly name = "RequiredFieldsError"

  constructor(
    readonly fields: string[]
  ) {
    super()
  }
  
  get message(): string {
    return `${this.fields.map((field) => field)}`
  }
}

export class InvalidDataError extends Error {

  readonly name = 'InvalidDataError'

  constructor (
    readonly field: string
  ){
    super()
  }

  get message(): string {
    return `${this.field}`
  }
}