"use strict";

const program = require("commander");
const https = require("https");

function onAfterSuccess(done)
{
  console.log('environment var keys ', Object.keys(process.env));

  if ( process.env.TRAVIS_PULL_REQUEST === "false" ) {
    console.log('skip adding artifact download url. not a pull request');
    return ;
  }

  if ( !process.env.GITHUB_TOKEN ){
    console.log('skip adding artifact download url. looks like environment variable GITHUB_TOKEN is not set');
    return ;
  }

  if (! process.env.ARTIFACTS_BUCKET) {
    console.log('skip adding artifact download url.is artifact uploading to s3 turned on in .travis.yml ?');
  }

  const requestBody = JSON.stringify({
    body: `Download url: https://s3.amazonaws.com/${process.env.ARTIFACTS_BUCKET}/${process.env.TRAVIS_REPO_SLUG}/${process.env.TRAVIS_BUILD_NUMBER}/dist/app.zip`
  });

  const requestOptions = {
    hostname: "api.github.com",
    method: "POST",
    path: `/repos/${process.env.TRAVIS_REPO_SLUG}/issues/${process.env.TRAVIS_PULL_REQUEST}/comments`,
    headers: {
      'Content-Length': Buffer.byteLength(requestBody),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `token ${process.env.GITHUB_TOKEN}`
    }
  };

  const request = https.request(requestOptions, (res) => {
    res.setEncoding('utf8');

    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });

    res.on('end', () => {
      console.log('No more data in response.');
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
 * @param {String} path
 * @param {Command} cmd
 * @param {function} done
 */
function action(path, cmd, done)
{
  if (! cmd.step) {
    console.log('ERROR: missing required argument: --step');
    process.exit(1);
  }

  if (cmd.step === 'after_success') {
    onAfterSuccess(done)
  }
}

program
  .version("0.1.0", "-V, --version")
  .arguments("<path>", "r")
  .option("-s, --step <step>", "the travis step to invoke inside the project at <path>")
  .action(action)
  .parse(process.argv);