import { defineConfig } from 'vite';
import { nodeExternals } from 'rollup-plugin-node-externals';

export default defineConfig({
  plugins: [nodeExternals()],
  build: {
    target: 'node16',
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: './src/index.ts',
        express: './src/express/index.ts',
        cli: './src/cli/index.ts',
      },
    },
  },
});
