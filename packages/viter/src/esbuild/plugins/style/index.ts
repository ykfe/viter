import path from 'path';
import fs from 'fs';
import postcss, { AcceptedPlugin } from 'postcss';
import cssModules from 'postcss-modules';
import temp from 'temp';
import { OnLoadArgs, OnLoadResult, OnResolveArgs, OnResolveResult, PluginBuild } from 'esbuild';

import './modules'; // keep this import for enabling modules types declaration ex: import styles from 'styles.module.sass'
// import Less from 'less';
import { renderStyle } from './utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const resolveFile = require('resolve-file');

interface PluginOptions {
  extract?: boolean;
  cssModulesMatch?: RegExp;
  postcss?: AcceptedPlugin[];
  less?: Less.Options;
}

const LOAD_TEMP_NAMESPACE = 'temp_stylePlugin';
const LOAD_STYLE_NAMESPACE = 'stylePlugin';
const styleFilter = /.\.(css|sass|scss|less|styl)$/;

const handleCSSModules = (mapping: { data: any }) =>
  cssModules({
    getJSON: (_, json) => {
      mapping.data = JSON.stringify(json, null, 2);
    },
  });

const onStyleResolve = async (args: OnResolveArgs): Promise<OnResolveResult> => {
  const { namespace, resolveDir } = args;
  const targetPath = path.resolve(process.cwd(), './src');
  const k = '@';
  const patchedPath = args.path
    .replace(new RegExp(`^${k}\\/`), `${targetPath}/`)
    .replace(new RegExp(`^${k}$`), targetPath);
  // console.log(args.path, 'args');
  // console.log(targetPath, 'targetPath');
  // console.log(patchedPath, 'patchedPath');

  let fullPath = resolveFile(patchedPath, {});
  // console.log(fullPath, 'fullPath');
  if (!fullPath) fullPath = path.resolve(args.resolveDir, patchedPath);

  if (namespace === LOAD_STYLE_NAMESPACE) {
    return {
      path: fullPath,
      namespace: LOAD_TEMP_NAMESPACE,
      pluginData: { resolveDir },
    };
  }

  return {
    path: fullPath,
    namespace: LOAD_STYLE_NAMESPACE,
    watchFiles: [fullPath],
  };
};

const onTempLoad = async (args: OnLoadArgs): Promise<OnLoadResult> => {
  const { pluginData } = args;
  const data = await fs.promises.readFile(args.path);

  return {
    resolveDir: pluginData.resolveDir,
    contents: data,
    loader: 'css',
  };
};

const onStyleLoad =
  (options: PluginOptions) =>
  async (args: OnLoadArgs): Promise<OnLoadResult> => {
    // { extract: false } is for SSR since we only need the css mapping and not the actual css file
    const extract = options.extract === undefined ? true : options.extract;
    const cssModulesMatch = options.cssModulesMatch || /\.module\./;
    const isCSSModule = args.path.match(cssModulesMatch);

    // Render whatever style currently on the loader .css, .sass, .styl, .less
    let css = await renderStyle(args.path, options);

    const mapping = { data: {} };
    let plugins = options.postcss || [];
    let injectMapping = false;
    let contents = '';

    // Match file with extension .module. => styles.module.sass
    if (isCSSModule) {
      // We have css module file so we include the postcss-modules plugin
      plugins = [handleCSSModules(mapping), ...plugins];
      injectMapping = true;
    }

    // Makes no sense to process postcss if we don't have any plugins
    if (plugins.length > 0) {
      css = (await postcss(plugins).process(css, { from: args.path })).css;

      // Inject classnames mapping for css modules
      if (injectMapping) contents += `export default ${mapping.data};`;
    }

    // Write new css to a temporary file
    if (extract) {
      const writestream = temp.createWriteStream({ suffix: '.css' });
      writestream.write(css);
      writestream.end();

      // Inject import "new url path" so esbuild can resolve a new css file
      contents += `import ${JSON.stringify(writestream.path)};`;
    }

    return {
      resolveDir: path.dirname(args.path), // Keep resolveDir for onTempLoad anything resolve inside temp file must be resolve using source dir
      contents,
    };
  };

const stylePlugin = (options: PluginOptions = {}) => ({
  name: 'esbuild-style-plugin',
  setup: (build: PluginBuild) => {
    // Resolve all css or other style here
    build.onResolve({ filter: styleFilter }, onStyleResolve);

    // New temp files from rendered css must evaluated
    build.onLoad({ filter: /.*/, namespace: LOAD_TEMP_NAMESPACE }, onTempLoad);

    // Render css with CSS Extensions / Preprocessors and PostCSS
    build.onLoad({ filter: /.*/, namespace: LOAD_STYLE_NAMESPACE }, onStyleLoad(options));
  },
});

export default stylePlugin;
