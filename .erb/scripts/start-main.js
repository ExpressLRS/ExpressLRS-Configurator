/**
 * Dev-mode entry point for the Electron main process.
 *
 * Node 24 has native TypeScript strip-types enabled by default, which
 * conflicts with ts-node's require hook and doesn't support
 * emitDecoratorMetadata (needed by TypeDI / type-graphql). By using a
 * plain .js entry point we avoid Node's native TS handler entirely and
 * let ts-node do the full compilation.
 */
require('ts-node').register({ transpileOnly: true });
require('../../src/main/main');
