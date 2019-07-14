import { NonNever } from "ts-essentials"

// type schemas

export interface IdentityType<T> {
  $$identityType: T
}

export interface ArrayType<S extends AnyType> {
  $$arrayType: TypeToData<S>[]
}

export interface ObjectOfTypes {
  [k: string]: AnyType
}

/**
 * Checks if a value is optional (undefined, any or unknown).
 * @hidden
 *
 * Examples:
 * - string = false
 * - undefined = true
 * - string | undefined = true
 * - string & undefined = false, but we don't care
 * - any = true
 * - unknown = true
 */
type IsOptionalValue<C, TV, FV> = undefined extends C ? TV : FV

// type _A = IsOptionalValue<string, true, false> // false
// type _B = IsOptionalValue<undefined, true, false> // true
// type _C = IsOptionalValue<string | undefined, true, false> // true
// type _D = IsOptionalValue<string & undefined, true, false> // false, but we don't care
// type _E = IsOptionalValue<any, true, false> // true
// type _F = IsOptionalValue<unknown, true, false> // true

export interface ObjectType<S extends ObjectOfTypes> {
  $$objectType: NonNever<
    {
      [k in keyof S]: IsOptionalValue<TypeToData<S[k]>, never, TypeToData<S[k]>>
    }
  > &
    {
      [k in keyof S]?: TypeToData<S[k]>
    }
}

export interface ObjectTypeFunction<S extends ObjectOfTypes> {
  (): S
}

export interface OrType<S extends AnyType[]> {
  $$orType: TypeToData<S[number]>
}

export type AnyType =
  | IdentityType<any>
  | ArrayType<any>
  | OrType<any>
  | ObjectType<any>
  | ObjectTypeFunction<any>

// type schemas to actual types

export type TypeToData<S extends AnyType> = S extends IdentityType<any>
  ? S["$$identityType"]
  : S extends ArrayType<any>
  ? S["$$arrayType"]
  : S extends OrType<any>
  ? S["$$orType"]
  : S extends ObjectType<any>
  ? S["$$objectType"]
  : S extends ObjectTypeFunction<infer S2>
  ? ObjectType<S2>["$$objectType"]
  : never
