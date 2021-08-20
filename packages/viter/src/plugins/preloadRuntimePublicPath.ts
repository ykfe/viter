import { Plugin, ResolvedConfig } from 'vite';

type Options = {
  /**
   * default: window.__publicPath__
   */
  preloadBaseMarker?: string;
};
// default value
const defaultOptions: Options = {
  preloadBaseMarker: 'window.__publicPath__',
};

export default function usePreloadRuntimePublicPath(options: Options = defaultOptions): Plugin {
  const preloadMarker = `__VITE_PRELOAD__`;

  const { preloadBaseMarker = defaultOptions.preloadBaseMarker } = options;
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-dynamic-base',
    enforce: 'post',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    generateBundle({ format }, bundle) {
      if (format !== 'es') {
        return;
      }

      Object.keys(bundle).map((file) => {
        const chunk = bundle[file];
        if (chunk.type === 'chunk' && chunk.code.indexOf(preloadMarker) > -1) {
          chunk.code = chunk.code.replace(
            `const base = "${config.base}";\nconst __vitePreload`,
            `const base = ${preloadBaseMarker};\nconst __vitePreload`
          );
        }
        return chunk;
      });
    },
  };
}
