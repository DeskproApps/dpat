"use strict";

const program = require("commander");
const archiver = require("archiver");
const fs = require("fs");

const AsyncAction = require('../../../commander/AsyncAction');
const defaultWebpackConfig = require.resolve('../webpack/webpack.config-distribution');
const __path = require("path");

const project = require("../Project");
const packageFilename = 'app.zip';

/**
 * @param {String} path
 * @param {String} instance
 * @param {Command} cmd
 * @param {function} done
 */
function action(path, instance, cmd, done)
{
  let projectDir;
  if (path) {
    projectDir = __path.resolve(path);
  } else {
    projectDir = __path.resolve('.');
  }

  if (! cmd.username) {
    console.log('ERROR: missing required argument: --username');
    process.exit(1);
  }

  if (! cmd.password) {
    console.log('ERROR: missing required argument: --password');
    process.exit(1);
  }

  const dpProject = project.newInstance();

  // TODO verify project dir is a valid dp apps project
  // TODO handle failure
  if (! dpProject.runPrepareCompile(projectDir)) {
    console.log('ERROR: failed to prepare for compile');
    process.exit(1);
  }

  if (! dpProject.runCompile(projectDir, defaultWebpackConfig)) {
    console.log('ERROR: failed to compile');
    process.exit(1);
  }

  let packagePath;
  try {
    packagePath = dpProject.runPackage(projectDir, packageFilename);
  } catch (e) {
    console.log('ERROR: failed to package');
    process.exit(1);
  }

  const dpApiClient = project.newApiClientInstance(instance);
  dpApiClient.api_tokens({ email: cmd.username, password: cmd.password })
  .then(function (result) {
    const parsedBody = JSON.parse(result.body);
    const token = parsedBody.data.token;
    return dpApiClient.authenticate(token);
  })
  .then(function (dpClient) {
    return dpProject.runDeploy(packagePath, dpClient)
  })
  .then(function () {
    console.log(`SUCCESS: Application project: ${projectDir}  deployed  to instance ${instance}`);
    done();
  })
  .catch(function(e) {
    console.log(e, 'ERROR: failed to deploy');
    process.exit(1);
    done();
  })
  ;
}

program
  .version("0.1.0", "-V, --version")
  .arguments("[path] <instance>")
  .option("-u, --username <username>", "the deployer's account username on <instance>")
  .option("-p, --password <password>", "the deployer's account password on <instance>")
  .action(AsyncAction(action))
  .parse(process.argv);
