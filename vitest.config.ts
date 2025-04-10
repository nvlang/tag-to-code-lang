import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        dir: './tests',
        maxConcurrency: 100,
        coverage: {
            reporter: ['text', 'json', 'html', 'lcov'],
            enabled: true,
            include: ['src'],
            ignoreEmptyLines: true,
            reportOnFailure: true,
        },
        reporters: ['default', 'github-actions', 'html'],
        env: { NODE_ENV: 'development' },
    },
});
