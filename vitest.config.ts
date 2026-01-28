import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
		'*.yml',
		'*.json',
		'.github/',
        'dist/',
        '**/*.test.ts',
        '**/test-utils/**',
        '**/*.d.ts',
        '**/types.ts',
        '**/index.ts',
        '**/vite.config.*',
        '**/vitest.config.*',
      ],
      include: ['src/**/*.{js,ts}'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
});
