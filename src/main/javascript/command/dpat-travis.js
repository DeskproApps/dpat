"use strict";

const program = require("commander");
const https = require("https");
const AsyncAction = require('../../../commander/AsyncAction');

/**
 * @param {{}} travisEnv
 * @param {{}} opts
 * @param {function} done
 */
function githubPRComment(travisEnv, opts, done)
{
  if ( travisEnv.TRAVIS_PULL_REQUEST === "false" ) {
    console.log('skip adding artifact download url. not a pull request');
    return ;
  }

  if (! travisEnv.ARTIFACTS_BUCKET) {
    console.log('skip adding artifact download url.is artifact uploading to s3 turned on in .travis.yml ?');
    return ;
  }

  const requestBody = JSON.stringify({
    body: `TRAVIS-CI: download build from https://s3.amazonaws.com/${travisEnv.ARTIFACTS_BUCKET}${opts.s3TargetPath}/dist/app.zip`
  });

  const requestOptions = {
    hostname: "api.github.com",
    method: "POST",
    path: `/repos/${travisEnv.TRAVIS_REPO_SLUG}/issues/${travisEnv.TRAVIS_PULL_REQUEST}/comments`,
    headers: {
      'Content-Length': Buffer.byteLength(requestBody),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `token ${travisEnv.GITHUB_TOKEN}`,
      'User-Agent': travisEnv.TRAVIS_REPO_SLUG
    }
  };

  const request = https.request(requestOptions, (res) => {
    res.setEncoding('utf8');

    if (opts.debug) {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
    }

    // need to add a data event listener so that the end event is triggered
    res.on('data', (chunk) => {
      if (opts.debug) {
        console.log(`BODY: ${chunk}`);
      }
    });

    res.on('end', () => {
      done();
    });
  });

  request.on('error', (e) => {
    console.error(e);
    done();
  });
  request.write(requestBody);
  request.end();
}

/**
 * @param {String} subcommand
 * @param {String} path
 * @param {Command} cmd
 * @param {function} done
 */
function action(subcommand, path, cmd, done)
{
  if (subcommand === 'pr-comment') {

    if (! cmd.s3target) {
      console.error('ERROR: missing required argument: --s3-target-path');
      process.exit(1);
    }

    if (process.env.GITHUB_TOKEN) {
      const opts = { debug: !!cmd.debug, s3TargetPath: cmd.s3target };
      githubPRComment(process.env, opts, done);
      return ;
    }

    console.warn('skip adding comment on pull request. no vcs configuration detected');
    done();
  }

  console.error('ERROR: invalid subcommand');
  process.exit(1);
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<subcommand> <path> ", "r")
  .option("-t, --s3target <s3target>", "the s3 path under which the build artifacts will be uploaded")
  .option("-d, --debug [debug]", "turn on debugging")
  .action(AsyncAction(action))
  .parse(process.argv);