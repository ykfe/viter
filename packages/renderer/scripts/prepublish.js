#!/usr/bin/env node

const path = require('path');
const prePublish = require('../../../scripts/prepublish');

prePublish('@viter/renderer', path.join(__dirname, '../'));
