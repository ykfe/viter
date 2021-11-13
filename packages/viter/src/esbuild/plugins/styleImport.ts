import { Loader, Plugin } from 'esbuild';
import fsExtra from 'fs-extra';
import path from 'path';

export interface EsbuildPluginImportOption {
  libraryName: string;
  /**
   * @default 'lib'
   */
  libraryDirectory?: string;
  style?: 'css' | boolean | ((importName: string, importPath: string) => string);
  styleLibraryDirectory?: string;
  customStyleName?: string;
  /**
   * @default true
   */
  camel2DashComponentName?: boolean;
  camel2UnderlineComponentName?: boolean;
  // fileName?: string;
  // customName?: string;
  /**
   * @default true
   */
  transformToDefaultImport?: boolean;
  ignoreImports?: (RegExp | string)[];
}

export const transCamel = (str: string, symbol: string) => {
  // eslint-disable-next-line no-underscore-dangle
  const _str = str[0].toLowerCase() + str.substr(1);
  return _str.replace(/([A-Z])/g, ($1) => `${symbol}${$1.toLowerCase()}`);
};

export const transWinPath = (modulePath: string) => modulePath.replace(/\\/g, '/');

const importReg = /^import\s+{((?:.|\n)*?)}\s+from\s+['"](.*?)['"];?/m;

// eslint-disable-next-line max-statements
const generateImportExpression = (
  importExpressionInfo: {
    importExpression: string;
    memberString: string;
    libraryString: string;
  },
  config: EsbuildPluginImportOption
) => {
  const { memberString, libraryString } = importExpressionInfo;

  const {
    libraryDirectory = 'lib',
    camel2DashComponentName = true,
    camel2UnderlineComponentName,
    styleLibraryDirectory,
    // customStyleName,
    style = false,
    ignoreImports,
    transformToDefaultImport = true,
  } = config;

  const importLines = [];
  const members = memberString
    .replace(/\/\/.*/gm, '') // ignore comments //
    .replace(/\/\*(.|\n)*?\*\//gm, '') // ignore comments /* */
    .split(',')
    .map((v) => v.replace(/(^\s+|\s+$)/g, ''))
    .filter(Boolean);

  const ignoreImportNames = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const member of members) {
    const [rawMemberName, aliasMemberName] = member.split(/\s+as\s+/);
    const memberName = aliasMemberName || rawMemberName;

    if (ignoreImports?.length) {
      const isIgnore = ignoreImports.some((ignoreReg) => {
        if (typeof ignoreReg === 'string') {
          return ignoreReg === rawMemberName;
        }
        return ignoreReg.test(rawMemberName);
      });
      if (isIgnore) {
        ignoreImportNames.push(member);
        // eslint-disable-next-line no-continue
        continue;
      }
    }

    // eslint-disable-next-line no-nested-ternary
    const transformedMemberName = camel2UnderlineComponentName
      ? transCamel(rawMemberName, '-')
      : camel2DashComponentName
      ? transCamel(rawMemberName, '-')
      : rawMemberName;

    const memberImportDirectory = path.join(libraryString, libraryDirectory, transformedMemberName);

    let stylePath = memberImportDirectory;

    if (styleLibraryDirectory) {
      stylePath = path.join(stylePath, styleLibraryDirectory);
    } else if (style === true) {
      stylePath = path.join(stylePath, 'style');
      importLines.push(`import "${stylePath}";`);
    } else if (style === 'css') {
      stylePath = path.join(stylePath, 'style', 'css');
      importLines.push(`import "${stylePath}";`);
    } else if (typeof style === 'function') {
      stylePath = style(rawMemberName, stylePath);
      importLines.push(`import "${stylePath}";`);
    }

    if (transformToDefaultImport) {
      importLines.push(`import ${memberName} from "${memberImportDirectory}";`);
    } else {
      importLines.push(`import {${memberName}} from "${memberImportDirectory}";`);
    }
  }

  if (ignoreImportNames.length) {
    importLines.push(`import {${ignoreImportNames.join(',')}} from "${libraryString}";`);
  }

  return importLines.map((line) => transWinPath(line)).join('\n');
};

const generateNewContent = (
  content: string,
  libraryConfigMap: Record<string, EsbuildPluginImportOption>
) => {
  let newContent = '';
  let matchContent = content;

  while (true) {
    const matches = importReg.exec(matchContent);

    if (!matches) {
      break;
    }
    const [importExpression, memberString, libraryString] = matches;

    const config = libraryConfigMap[libraryString];

    if (config) {
      newContent += matchContent.substring(0, matches.index);

      newContent += generateImportExpression(
        { importExpression, memberString, libraryString },
        config
      );
    } else {
      newContent += matchContent.substring(0, matches.index + importExpression.length);
    }

    matchContent = matchContent.substring(
      matches.index + importExpression.length,
      matchContent.length
    );
  }
  newContent += matchContent;

  return newContent;
};

export const esbuildPluginImport = (options: EsbuildPluginImportOption[] = []) => {
  const plugin: Plugin = {
    name: 'esbuild-plugin-import',
    setup(build) {
      const filter = /[t|j]sx?$/;

      const libraryConfigMap = options.reduce((pre, option) => {
        if (option.libraryName) {
          pre[option.libraryName] = option;
        }
        return pre;
      }, {} as Record<string, EsbuildPluginImportOption>);

      build.onLoad({ filter }, async (args) => {
        const { path: filePath, namespace } = args;

        let fileContent = '';

        if (namespace === 'file') {
          const fileContentBuffer = await fsExtra.readFile(filePath);
          fileContent = fileContentBuffer.toString();
        }

        const content = generateNewContent(fileContent, libraryConfigMap);

        return {
          contents: content,
          loader: path.extname(filePath).replace('.', '') as Loader,
        };
      });
      return undefined;
    },
  };
  return plugin;
};
