import { TextDecoder } from 'util';
import path from 'path';
import fs from 'fs';
import Less from 'less';

export interface RenderOptions {
  less?: Less.Options;
}

export const getModule = async (moduleName: string) => {
  try {
    return (await import(moduleName)).default;
  } catch {
    throw new Error(`Missing module. Please install '${moduleName}' package.`);
  }
};

export const renderStyle = async (
  filePath: string,
  options: RenderOptions = {}
): Promise<string> => {
  const { ext } = path.parse(filePath);

  if (ext === '.css') {
    return (await fs.promises.readFile(filePath)).toString('utf-8');
  }

  if (ext === '.less') {
    const lestOptions = options.less || {};
    const source = await fs.promises.readFile(filePath);
    const less = await getModule('less');
    return (
      await less.render(new TextDecoder().decode(source), { ...lestOptions, filename: filePath })
    ).css;
  }

  throw new Error(`Can't render this style '${ext}'.`);
};
