'use strict';

const program = require('commander');
const fs = require('fs');

const project = require('../Project').newInstance();
const config = require('../../resources/configuration.json');

function action(path, cmd) {

  const sourceRepository = cmd.boilerplate || config.boilerplate.react;

  if (!fs.existsSync(path)) {
    project.initialize(path, sourceRepository);
    console.log(`SUCCESS: project initialized in: ${path}`);
    return;
  }

  if (!project.validateInitializeDirectory(path)) {
      console.error(`ERROR: ${path} is not a valid application directory`);
      process.exit(1);
  }

  const destinationEmpty = 0 === fs.readdirSync(path).length;
  if (!destinationEmpty && !cmd.force) {
      console.error(`ERROR: ${path} is not empty. use --force to create anyway`);
      process.exit(1);
  }

  project.initialize(path, sourceRepository);
  console.log(`SUCCESS: project initialized in: ${path}`);
}

program
    .version('0.1.0', '-V, --version')
    .option('-b, --boilerplate', 'which boilerplate project to use')
    .option('-f, --force', 'overwrite if folder not empty')
    .arguments('<path>')
    .action(action)
    .parse(process.argv);

