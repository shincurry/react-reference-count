import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import jsx from 'acorn-jsx';

import pkg from './package.json' assert { type: 'json' };

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      name: 'react-reference-count'
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  external: [
    'react', 'react-dom',
    'events',
  ],
  acornInjectPlugins: [
    jsx(),
  ],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ]
};
export default config;