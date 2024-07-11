import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ['./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        maxConcurrency: 100,
        testTimeout: 10e3, // 10 seconds
        coverage: {
            reporter: ['text', 'json', 'html', 'lcov'],
            enabled: true,
            include: ['src/**/*.ts'],
            exclude: [
                '**/node_modules/**',
                '**/tests/**',
                '**/dist/**',
                '**/coverage/**',
                '**/*.config.{ts,js,cjs,mjs,jsx,tsx}',
                '**/*.d.ts',
                '**/html/**',
            ],
            ignoreEmptyLines: true,
            reportOnFailure: true,
        },
        // reporters: ['default', 'github-actions', 'html'],
        env: { NODE_ENV: 'development' },
    },
});
