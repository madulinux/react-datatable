import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
  ],
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.conditions = ['module'];
    // Ensure React is not bundled from any dependency
    options.alias = {
      'react': 'react',
      'react-dom': 'react-dom',
    };
  },
  noExternal: [
    // Bundle these but they will use external React
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-slot',
  ],
});
