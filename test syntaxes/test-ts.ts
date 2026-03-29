/**
 * TypeScript syntax stress-test for theme tuning.
 * @module test-ts
 */

import assert from "node:assert/strict";

// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

type Status = "idle" | "loading" | "ok" | "error";
interface User {
  readonly id: string;
  name: string;
  tags?: string[];
  metadata: Record<string, unknown>;
}

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/** Stand-ins so we do not depend on @types/react in this fixture. */
type ReactNode = unknown;
type FC<P> = (props: P) => unknown;

interface PropsWithChildren {
  children?: ReactNode;
}

// Template literal types
type HttpMethod = `GET` | `POST` | `PUT` | `DELETE`;
type ApiRoute = `/api/v${1 | 2}/${string}`;

// Mapped & conditional types
type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
};

type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

// ---------------------------------------------------------------------------
// Enums & const assertions
// ---------------------------------------------------------------------------

enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

const THEME = {
  mint: "#96ccb9",
  gold: "#e6c37e",
  crimson: "#92263f",
} as const;

type ThemeKey = keyof typeof THEME;

// ---------------------------------------------------------------------------
// Generics & classes
// ---------------------------------------------------------------------------

class Container<T> {
  #value: T | undefined;

  constructor(initial?: T) {
    this.#value = initial;
  }

  get(): T | undefined {
    return this.#value;
  }

  set(next: T): void {
    this.#value = next;
  }
}

abstract class BaseService {
  abstract connect(url: URL): Promise<void>;
  protected log(msg: string): void {
    console.info(`[BaseService] ${msg}`);
  }
}

class ApiClient extends BaseService {
  async connect(url: URL): Promise<void> {
    await fetch(url, { method: "GET" });
  }
}

// ---------------------------------------------------------------------------
// Functions: overloads, generics, assertions
// ---------------------------------------------------------------------------

function parseId(input: string): number;
function parseId(input: number): string;
function parseId(input: string | number): string | number {
  if (typeof input === "string") return Number.parseInt(input, 10);
  return String(input);
}

async function loadUser(id: string): Promise<User | null> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) return null;
  return (await res.json()) as User;
}

function assertIsUser(x: unknown): asserts x is User {
  assert(x && typeof (x as User).id === "string");
}

// ---------------------------------------------------------------------------
// Decorators (syntax; may need experimentalDecorators)
// ---------------------------------------------------------------------------

function sealed(ctor: new (...args: unknown[]) => object) {
  Object.seal(ctor);
  Object.seal(ctor.prototype);
}

@sealed
class SealedBox {
  value = 42;
}

// ---------------------------------------------------------------------------
// Control flow & literals
// ---------------------------------------------------------------------------

const regex = /\/api\/(?<version>v\d+)\/(?<id>[a-z0-9-]+)/gi;
const big = 1_000_000n;
const sym = Symbol("desc");

export function demoControlFlow(status: Status): string {
  switch (status) {
    case "idle":
      return "waiting";
    case "loading":
      return "…";
    case "ok":
    case "error":
      return `done:${status}`;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

// ---------------------------------------------------------------------------
// JSX-like type usage (without JSX emit)
// ---------------------------------------------------------------------------

declare const Fragment: FC<PropsWithChildren>;
const _el: FC<{ title: string }> = (_props) => null;

// ---------------------------------------------------------------------------
// Export forms
// ---------------------------------------------------------------------------

export type { User, Status, Result };
export { Priority, THEME, Container, ApiClient, loadUser, parseId };
