#!/usr/bin/env node

const path = require('path');
const prePublish = require('../../../scripts/prepublish');

prePublish('@viter/rollup-preset-config', path.join(__dirname, '../'));
