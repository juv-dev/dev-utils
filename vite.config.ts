// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'dev-utils',
      fileName: (format) => `dev-utils.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['fs', 'path', 'child_process', 'process'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          fs: 'fs',
          path: 'path',
          child_process: 'child_process',
          process: 'process',
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  test: {
    // Vitest configurations
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/test-utils/**',
      ],
    },
  },
});