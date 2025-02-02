export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly _tag: "success";
  readonly value: T;
}

export interface Failure<E> {
  readonly _tag: "failure";
  readonly error: E;
}

export const success = <T>(value: T): Success<T> => ({
  _tag: "success",
  value,
});

export const failure = <E>(error: E): Failure<E> => ({
  _tag: "failure",
  error,
});
