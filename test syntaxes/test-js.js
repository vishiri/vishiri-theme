/**
 * JavaScript syntax stress-test for theme tuning.
 * @file test-js.js
 */

"use strict";

import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Declarations: var, let, const, destructuring
// ---------------------------------------------------------------------------

var legacyCounter = 0;
let mutable = { a: 1 };
const IMMUTABLE_REF = Object.freeze({ x: 0 });

const [first, ...rest] = [1, 2, 3, 4];
const { name: userName = "guest", ...extras } = { name: "Ada", role: "admin" };
const shorthand = 100;

// ---------------------------------------------------------------------------
// Functions: arrow, async, generator, default params
// ---------------------------------------------------------------------------

function classic(a, b = 1, ...nums) {
  return a + b + nums.reduce((s, n) => s + n, 0);
}

const arrow = (x) => (y) => x * y;

async function fetchJson(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function* idGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

// ---------------------------------------------------------------------------
// Classes: extends, static, private fields (instance of)
// ---------------------------------------------------------------------------

class Animal {
  static kingdom = "Animalia";
  #secret = "dna";

  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  static species = "Canis familiaris";

  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog("Rex");
console.assert(dog instanceof Dog && dog instanceof Animal);

// ---------------------------------------------------------------------------
// Objects, computed keys, shorthand, spread
// ---------------------------------------------------------------------------

const key = "dynamic";
const obj = {
  [key]: 1,
  shorthand,
  method() {
    return this.shorthand;
  },
  async asyncMethod() {
    return Promise.resolve(42);
  },
  ...extras,
};

// ---------------------------------------------------------------------------
// Template literals & tagged templates
// ---------------------------------------------------------------------------

const multiline = `
  line one
  ${userName} — ${classic(1, 2, 3)}
  regex inside \${not} interpolated
`;

function tag(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
}

const tagged = tag`hello ${userName}`;

// ---------------------------------------------------------------------------
// Regex, BigInt, Symbol
// ---------------------------------------------------------------------------

const re = /foo(bar)?/gimsu;
const bigintVal = 9007199254740993n;
const unique = Symbol.for("app.unique");

// ---------------------------------------------------------------------------
// try / catch / finally, optional chaining, nullish coalescing
// ---------------------------------------------------------------------------

try {
  mutable?.a?.toFixed?.(2);
  const v = null ?? undefined ?? 0;
  void v;
} catch (err) {
  console.error(err?.message ?? String(err));
} finally {
  legacyCounter++;
}

// ---------------------------------------------------------------------------
// Loops: for-of, for-in, while, labeled break
// ---------------------------------------------------------------------------

outer: for (const n of rest) {
  for (const k in obj) {
    if (n > 2) break outer;
  }
}

// ---------------------------------------------------------------------------
// Export (ESM)
// ---------------------------------------------------------------------------

export { classic, arrow, fetchJson, Dog, obj, re };
export default function main() {
  return idGenerator().next().value;
}
