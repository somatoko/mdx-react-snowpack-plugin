const fs_async = require('fs').promises
const mdx = require('@mdx-js/mdx')
const babel = require('@babel/core')

const setup = {
  name: 'mdx-react-snowpack-plugin',
  babelPresets: ['@babel/preset-react'],
  mdx: '@mdx-js/react',
}

module.exports = function (cfg, opts) {
  return {
    name: setup.name,
    knownEntrypoints: [setup.mdx],
    resolve: { input: ['.md', '.mdx'], output: ['.js'], },

    async load({ filePath }) {
      const babelConf = babel.loadPartialConfig({presets: setup.babelPresets})

      const mdxContent = await fs_async.readFile(filePath, 'utf-8')
      const jsxContent = `import { mdx } from '${setup.mdx}';\n${await mdx(mdxContent)}`
      const jsContent = await babel.transformAsync(jsxContent, babelConf.options)

      return {
        '.js': { code: jsContent.code || ''}
      }
    },
  };
};