import { Container } from "inversify";

export type ResolveOnlyContainer = Pick<
  Container,
  | "get"
  | "getAll"
  | "getNamed"
  | "getTagged"
  | "isBound"
  | "isBoundNamed"
  | "isBoundTagged"
>;

export type LoadOnlyContainer = Pick<
  Container,
  "load" | "loadAsync" | "unload"
>;
