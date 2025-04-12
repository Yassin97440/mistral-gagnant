import { defineConfig } from 'tsup';
// tsup.config.ts
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: true,
    bundle: false,          // <- le plus important ici
    outDir: 'dist',
    sourcemap: true,
    clean: true
});