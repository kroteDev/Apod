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

export class InternalServerError extends Error {

  readonly name = "InternalServerError"

  constructor(
    readonly error: string
  ) {
    super()
  }

  get message(): string {
    return `Falha ao conectar com o endereço: ${this.error}`
  }
}

export class UnauthorizedServerError extends Error {

  readonly name = "UnauthorizedServerError"

  constructor(
    readonly url: string
  ) {
    super()
  }

  get message(): string {
    return `Acesso negado no endereço: ${this.url}`
  }
}