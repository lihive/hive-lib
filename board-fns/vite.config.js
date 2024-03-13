import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/board-fns',
  plugins: [solid(), tsconfigPaths()],
  build: {
    outDir: './dist'
  }
});
