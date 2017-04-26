'use strict';

const fs = require("fs");
const path = require("path");
const shelljs = require('shelljs');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const archiver = require("archiver");

const Validator = require("jsonschema").Validator;

class DeskproProject
{
    /**
     * @param {Object} manifestSchema
     * @param {String} source
     */
    constructor(manifestSchema, source) {
        this.manifestSchema = manifestSchema;
        this.source = source;
    }

    /**
     * @param {String} manifestPath
     * @returns {boolean}
     */
    validateManifest(manifestPath)
    {
        if (!fs.existsSync(manifestPath)) {
            return false;
        }

        let contents = fs.readFileSync(manifestPath, "utf8").toString("utf8");
        let manifest = JSON.parse(contents);

        if (!manifest) {
            return false;
        }

        let syntaxValidation = (new Validator()).validate(manifest, this.manifestSchema);
        if (0 !== syntaxValidation.errors.length) {
            return false;
        }

        //verify target files
        let rootDir = path.parse(manifestPath).dir;
        const targetFiles = [];
        for (let key of Object.keys(manifest.targets)) {
            targetFiles.push( path.resolve(rootDir, manifest.targets[key].url) );
        }

        for (let file of targetFiles) {
            if (!fs.existsSync(file)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param {String} path
     * @returns {boolean}
     */
    validateInitializeDirectory(path)
    {
        const stats = fs.lstatSync(path);
        if (!stats.isDirectory()) {
            return false;
        }

        try {
            fs.accessSync(path, fs.W_OK);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Checks if a path represents a valid deskpro app project directory
     *
     * @param {String} dir
     * @returns {boolean}
     */
    validateProjectDirectory(dir)
    {
        if (! this.validateInitializeDirectory(dir)) {
            return false;
        }

        const manifestPath = path.resolve(dir, "manifest.json");
        return fs.existsSync(manifestPath);

        //return this.validateManifest(manifestPath);
    }

    initialize(destination, sourceRepository)
    {
      const absoluteDestination = path.resolve(destination);

      try {
        if (!fs.existsSync(absoluteDestination)) {
          shelljs.mkdir('-p', destination);
        }
      } catch (e) {
        console.log(`failed to create project dir: ${absoluteDestination}`);
        return;
      }

      if (shelljs.exec(`git clone ${sourceRepository} ${absoluteDestination}`, { cwd: absoluteDestination, stdio: 'inherit' }).code !== 0) {
        console.log(`failed to initialize project in ${absoluteDestination}`);
        return;
      }

      const gitDir = path.join(absoluteDestination, '.git');
      try {
        shelljs.rm('-rf', gitDir);
      } catch (e) {
        console.log(
          `failed to initialize a new git repository in ${absoluteDestination}.
           
           Run the following commands manually:
            rm -rf ${gitDir}
            git init ${absoluteDestination}`
        );
      }

      if (shelljs.exec(`git init ${absoluteDestination}`, { cwd: absoluteDestination, stdio: 'inherit' }).code !== 0) {
        console.log(
          `failed to initialize a new git repository in ${absoluteDestination}.
           
           Run the following command manually: 
            git init ${absoluteDestination}`
        );
      }

      if (shelljs.exec(`npm install --save-exact`, { cwd: absoluteDestination, stdio: 'inherit' }).code !== 0) {
        console.log(
          `failed to install dependencies in ${absoluteDestination}.
           
           Run the following command manually: 
            npm install --save-exact ${absoluteDestination}`
        );
      }
    }

  /**
   * @param {String} projectRoot
   * @param {String} packageFilename
   * @return {String} the full path to the created artifact
   */
    runPackage (projectRoot, packageFilename)
    {
      const projectDistDir = path.join(projectRoot, 'dist');
      const output = fs.createWriteStream(path.join(projectDistDir, packageFilename));
      const archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
      });

      archive.directory(path.join(projectDistDir, 'assets'), 'assets', {});
      archive.directory(path.join(projectDistDir, 'html'), 'html', {});
      archive.file(path.join(projectRoot, 'manifest.json'), { name: 'manifest.json' });

      archive.pipe(output);
      archive.finalize();

      return path.join(projectRoot, 'dist', packageFilename);
    }

  runPrepareCompile(projectDir)
  {
    const distFolder = path.resolve(projectDir, "dist");
    if (fs.existsSync(distFolder)) {
      try {
        shelljs.rm('-rf', distFolder + '/*');
        return true;
      } catch (e) {
        console.log(
          `failed to empty dist folder ${distFolder}.
             
             Run the following commands manually:
              rm -rf ${distFolder}`
        );
        return false;
      }
    }

    try {
      shelljs.mkdir('-p', distFolder);
      return true;
    } catch (e) {
      console.log(
        `failed to create dist folder ${distFolder}.
             
             Run the following commands manually:
              mkdir -p ${distFolder}`
      );
      return false;
    }
  }

  runCompile (projectRoot, defaultWebpackConfig)
  {
    const projectLocalConfig = path.resolve(projectRoot, "src", "webpack", "webpack.config-distribution.js");
    const webpackConfig = fs.existsSync(projectLocalConfig) ? projectLocalConfig : defaultWebpackConfig;

    const devServer = spawnSync(
      './node_modules/.bin/webpack'
      , ['--config', webpackConfig, '--env.DP_PROJECT_ROOT', projectRoot]
      , { cwd: projectRoot, stdio: 'inherit', env: { DP_PROJECT_ROOT: projectRoot } }
    );
    // TODO handle failure

    return true;
  }

  /**
   * @param {String} packagePath
   * @param {DeskproApiClient} authenticatedClient
   * @return {Promise.<TResult>}
   */
  runDeploy (packagePath, authenticatedClient)
  {
    const packageBuffer = fs.readFileSync(packagePath, { flag: 'r' });

    return authenticatedClient.apps(packageBuffer)
      .then(function (result) {
        return result;
      })
      .catch(function (result) {
        throw new Error('failed to deploy');
      });
  }

  /**
   * Starts a development server serving from <path> if path is a valid app project directory
   *
   * @param {String} projectRoot
   * @param {String} defaultWebpackConfig
   * @returns {boolean}
   */
  startDevServer(projectRoot, defaultWebpackConfig)
  {
      if (! this.validateProjectDirectory(projectRoot)) {
          return false;
      }

    const projectLocalConfig = path.resolve(projectRoot, "src", "webpack", "webpack.config-development.js");
    const webpackConfig = fs.existsSync(projectLocalConfig) ? projectLocalConfig : defaultWebpackConfig;

      const devServer = spawn(
          './node_modules/.bin/webpack-dev-server'
          , [
              '--config', webpackConfig,
              '--env.DP_PROJECT_ROOT', projectRoot
          ]
          , { cwd: projectRoot, stdio: 'inherit' }
      );

      devServer.on('exit', (code) => {
          console.log(`dpat server exited with code ${code}`);
      });

      return true;
  }
}

module.exports = DeskproProject;