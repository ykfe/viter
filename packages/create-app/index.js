#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable array-callback-return */

// @ts-check
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const { prompt } = require('enquirer');
const { cyan } = require('kolorist');

const cwd = process.cwd();

const TEMPLATES = [
  {
    name: 'react-admin-ts',
    color: cyan,
  },
];

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const list = fs.readdirSync(src);
    list.map((item) => {
      const srcFile = path.resolve(src, item);
      const destFile = path.resolve(dest, item);
      copy(srcFile, destFile);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  const list = fs.readdirSync(dir);
  list.map((item) => {
    const abs = path.resolve(dir, item);
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  });
}
const renameFiles = {
  _gitignore: '.gitignore',
};

async function getValidPackageName(projectName) {
  const packageNameRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (packageNameRegExp.test(projectName)) {
    return projectName;
  }
  const suggestedPackageName = projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');

  /**
   * @type {{ inputPackageName: string }}
   */
  const { inputPackageName } = await prompt({
    type: 'input',
    name: 'inputPackageName',
    message: `Package name:`,
    initial: suggestedPackageName,
    validate: (input) => (packageNameRegExp.test(input) ? true : 'Invalid package.json name'),
  });
  return inputPackageName;
}

async function init() {
  let targetDir = argv._[0];
  if (!targetDir) {
    /**
     * @type {{ projectName: string }}
     */
    const { projectName } = await prompt({
      type: 'input',
      name: 'projectName',
      message: `Project name:`,
      initial: 'viter-project',
    });
    targetDir = projectName;
  }
  const packageName = await getValidPackageName(targetDir);
  const root = path.join(cwd, targetDir);

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  } else {
    const existing = fs.readdirSync(root);
    if (existing.length) {
      /**
       * @type {{ yes: boolean }}
       */
      const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message:
          `${
            targetDir === '.' ? 'Current directory' : `Target directory ${targetDir}`
            // eslint-disable-next-line no-useless-concat
          } is not empty.\n` + `Remove existing files and continue?`,
      });
      if (yes) {
        emptyDir(root);
      } else {
        return;
      }
    }
  }

  // determine template
  let selectTemplate = argv.t || argv.template;
  const message = 'Select a framework:';
  const isValidTemplate = false;

  if (!selectTemplate || !isValidTemplate) {
    /**
     * @type {{ framework: string }}
     */
    // @ts-ignore
    const { template } = await prompt({
      type: 'select',
      name: 'template',
      message,
      format(name) {
        const ITEMPLATES = TEMPLATES.find((v) => v.name === name);
        return ITEMPLATES ? ITEMPLATES.color(ITEMPLATES.display || ITEMPLATES.name) : name;
      },
      choices: TEMPLATES.map((f) => ({
        name: f.name,
        value: f.name,
        message: f.color(f.display || f.name),
      })),
    });
    console.log(template);
    selectTemplate = template;
  }

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.join(__dirname, `template-${selectTemplate}`);

  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = fs.readdirSync(templateDir);

  files
    .filter((f) => f !== 'package.json')
    .map((file) => {
      write(file);
      return file;
    });

  // eslint-disable-next-line
  const pkg = require(path.join(templateDir, `package.json`));

  pkg.name = packageName;

  write('package.json', JSON.stringify(pkg, null, 2));

  const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm';

  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`);
  }
  console.log(`  ${pkgManager === 'yarn' ? `yarn` : `npm install`}`);
  console.log(`  ${pkgManager === 'yarn' ? `yarn dev` : `npm run dev`}`);
  console.log();
}

init().catch((e) => {
  console.error(e);
});
