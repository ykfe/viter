#!/usr/bin/env node

const sourceMapSupport = require('source-map-support');

if (!__dirname.includes('node_modules')) {
  sourceMapSupport.install();
}

require('../dist/cjs/cli');
