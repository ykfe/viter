#!/usr/bin/env node

const path = require('path');
const prePublish = require('../../../scripts/prepublish');

prePublish('@viterjs/eslint-config', path.join(__dirname, '../'));
