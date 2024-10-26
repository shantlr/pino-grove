import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        cli: './src/cli/index.ts',
      },
    },
  },
});
