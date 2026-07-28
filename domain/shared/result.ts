export class Failure<E, S> {
  readonly value: E

  constructor(value: E) {
    this.value = value
  }

  isError(): this is Failure<E, S> {
    return true
  }

  isSuccess(): this is Success<E, S> {
    return false
  }
}

export class Success<E, S> {
  readonly value: S

  constructor(value: S) {
    this.value = value
  }

  isError(): this is Failure<E, S> {
    return false
  }

  isSuccess(): this is Success<E, S> {
    return true
  }
}

export type Result<E, S> = Failure<E, S> | Success<E, S>

export const error = <E, S>(e: E): Result<E, S> => {
  return new Failure<E, S>(e)
}

export const success = <E, S>(s: S): Result<E, S> => {
  return new Success<E, S>(s)
}