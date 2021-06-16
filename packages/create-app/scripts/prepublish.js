#!/usr/bin/env node

const path = require('path');
const prePublish = require('../../../scripts/prepublish');

prePublish('@viter/create-app', path.join(__dirname, '../'));
