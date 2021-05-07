#!/usr/bin/env node

const path = require('path');
const prePublish = require('../../../scripts/prepublish');

prePublish('create-vite-app', path.join(__dirname, '../'));
