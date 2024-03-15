import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/test-generator',
  plugins: [solid(), tsconfigPaths()],
  build: {
    outDir: './dist'
  }
});