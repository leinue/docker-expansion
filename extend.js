#!/usr/bin/env node

require('shelljs/global');
var argv = require('yargs')
  .option('c', {
    alias : 'container',
    demand: true,
    describe: 'container name',
    type: 'string'
  })
  .option('s', {
    alias : 'size',
    demand: true,
    describe: 'device size',
  })
  .usage('Usage: extend.js [options]')
  .example('', 'extend device size')
  .help('h')
  .alias('h', 'help')
  .epilog('Gospely Copyright 2016')
  .argv;

var containerName = argv.c,
    size = argv.s;

var containerInfoBash = 'docker inspect ' + containerName;
var containerInfo = exec(containerInfoBash);

containerInfo = JSON.parse(containerInfo);

var container = {
  id: '',
  device: {}
}

container.id = containerInfo[0].Id;

var GraphDriver = containerInfo[0].GraphDriver.Data;
container.device = GraphDriver;

var sectorInfoBash = 'dmsetup table ' + container.device.DeviceName;
var sectorInfo = exec(sectorInfoBash);

sectorInfo = sectorInfo.stdout;

var sectorSize = sectorInfo.split(' ');
sectorSize = sectorSize[1];

sectorInfo = sectorInfo.replace(sectorSize, size).replace(/\r\n/g, '').replace(/\n/g, '');

//
var extendBash = 'echo ' + sectorInfo + ' | dmsetup load ' + container.device.DeviceName + ' && dmsetup resume ' + container.device.DeviceName + ' && xfs_growfs /dev/mapper/' + container.device.DeviceName;

var extendingReslt = exec(extendBash);

if(extendingReslt.code !== 0) {
   console.error(result);
}else {
   console.log('extend success');
}
