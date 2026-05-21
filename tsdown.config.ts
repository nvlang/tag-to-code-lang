import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/mod.ts'],
    format: 'esm',
    fixedExtension: false, // emit .js / .d.ts (package is "type": "module")
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
    target: 'es2020',
});
