#!/usr/bin/env node

var hw = require('headway')
var argv = require('minimist')(process.argv.slice(2))

require('../dist/tasks.js')(argv)

process.on('uncaughtException', function(err) {
  hw.log('{red}' + err)
  process.exit(1)
})
