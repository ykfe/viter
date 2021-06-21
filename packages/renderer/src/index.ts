import { generateEntry } from './generateTmpFiles';
function renderer(config: {}) {
  generateEntry({});
  return true;
}

export default renderer;
