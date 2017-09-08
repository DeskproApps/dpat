'use strict';

const fs = require("fs");
const path = require("path");
const shelljs = require('shelljs');
const spawn = require('child_process').spawn;
const spawnSync = require('child_process').spawnSync;
const archiver = require("archiver");

const ManifestResolver = require('../Manifest').Resolver;
const ManifestSyntaxValidator = require('../Manifest').SyntaxValidator;
const ManifestBuilder = require('../Manifest').Builder;

class DeskproProject
{
  /**
   * @param {SchemaRegistry} schemaRegistry
   * @param {String} source
   * @param {String} binPath
   */
    constructor(schemaRegistry, source, binPath) {
        this.schemaRegistry = schemaRegistry;
        this.source = source;
        this.binPath = binPath;
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

      // validate manifest syntax
      const src = new ManifestResolver().resolveSourceFromPath(dir);
      if (!src) { return false; }
      try {
        const manifest = new ManifestBuilder().setPropsFromSource(src).build();
        return new ManifestSyntaxValidator().validateManifest(manifest);
      } catch (e) {
        return false;
      }
    }

    initialize(destination, sourceRepository)
    {
      const absoluteDestination = path.resolve(destination);

      try {
        if (!fs.existsSync(absoluteDestination)) {
          shelljs.mkdir('-p', destination);
        }
      } catch (e) {
        console.error(`failed to create project dir: ${absoluteDestination}`);
        return;
      }

      const result = shelljs.exec(`git clone ${sourceRepository} ${absoluteDestination}`, { cwd: absoluteDestination, stdio: 'inherit' });
      if (result.stderr) {
        console.error(`failed to initialize project in ${absoluteDestination}`);
        return;
      }

      const gitDir = path.join(absoluteDestination, '.git');
      try {
        shelljs.rm('-rf', gitDir);
      } catch (e) {
        console.error(`
failed to initialize a new git repository in ${absoluteDestination}.
Run the following command manually: rm -rf ${gitDir} && git init ${absoluteDestination}
`);
      }

      if (shelljs.exec(`git init ${absoluteDestination}`, { cwd: absoluteDestination, stdio: 'inherit' }).code !== 0) {
        console.error(`
failed to initialize a new git repository in ${absoluteDestination}.
Run the following command manually: git init ${absoluteDestination}
`);
      }

      if (shelljs.exec(`npm install --save-exact`, { cwd: absoluteDestination, stdio: 'inherit' }).code !== 0) {
        console.error(`
failed to install dependencies in ${absoluteDestination}.        
Run the following command manually: npm install --save-exact ${absoluteDestination}
`);
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
    archive.file(path.join(projectDistDir, 'manifest.json'), { name: 'manifest.json' });

    archive.pipe(output);
    archive.finalize();

    return path.join(projectRoot, 'dist', packageFilename);
  }

  runPrepareCompile(projectDir)
  {
    const nodeModulesFolder = path.join(projectDir, "node_modules");
    if (! fs.existsSync(nodeModulesFolder)) {
      console.error(`
node_modules folder not found in ${projectDir}      
Make sure you run npm install
`);
    }

    const distFolder = path.resolve(projectDir, "dist");
    if (fs.existsSync(distFolder)) {
      try {
        shelljs.rm('-rf', distFolder + '/*');
        return true;
      } catch (e) {
        console.error(`
failed to empty dist folder ${distFolder}.           
Run the following commands manually: rm -rf ${distFolder}
`);
        return false;
      }
    }

    try {
      shelljs.mkdir('-p', distFolder);
      return true;
    } catch (e) {
      console.error(`
failed to create dist folder ${distFolder}.
Run the following commands manually: mkdir -p ${distFolder}
`);
      return false;
    }
  }

  /**
   * @param {String} projectRoot
   * @param {Object} runConfig
   * @return {boolean}
   */
  runCompile (projectRoot, runConfig)
  {
    const {webpack, webpackConfig, modulePaths} = runConfig;

    const localConfig = path.resolve(projectRoot, "src", "webpack", "webpack.config-distribution.js");
    const runtimeConfig = fs.existsSync(localConfig) ? localConfig : webpackConfig;
    const args = ['--config', runtimeConfig, '--env.DP_PROJECT_ROOT', projectRoot];

    let nodePath;
    if (process.env.NODE_PATH) {
      nodePath = process.env.NODE_PATH.split(path.delimiter).concat(modulePaths).join(path.delimiter);
    } else {
      nodePath = modulePaths.join(path.delimiter);
    }
    const env = { DP_PROJECT_ROOT: projectRoot, NODE_PATH: nodePath };
    const runtimeEnv = Object.assign({}, process.env, env);

    const childProcess = spawnSync(webpack, args, { cwd: projectRoot, stdio: 'inherit', env: runtimeEnv });
    if (childProcess.status === 0) {
      return true;
    }
    console.error(childProcess.error);
    return false;
  }

  /**
   * @param {String} projectRoot
   * @param {Object} runConfig
   * @return {boolean}
   */
  runTests (projectRoot, runConfig)
  {
    const { jest, modulePaths } = runConfig;

    const jestLocalConfig = path.resolve(projectRoot, ".jestrc.json");
    const args = fs.existsSync(jestLocalConfig) ? [ '-c', jestLocalConfig ] : [];

    const testRoot = path.resolve(projectRoot, 'src', 'test');
    args.push(testRoot);

    let nodePath;
    if (process.env.NODE_PATH) {
      nodePath = process.env.NODE_PATH.split(path.delimiter).concat(modulePaths).join(path.delimiter);
    } else {
      nodePath = modulePaths.join(path.delimiter);
    }
    const env = { DP_PROJECT_ROOT: projectRoot, NODE_PATH: nodePath };
    const runtimeEnv = Object.assign({}, process.env, env);

    const childProcess = spawnSync(jest, args, { cwd: projectRoot, stdio: 'inherit', env: runtimeEnv });
    if (childProcess.status === 0) {
      return true;
    }
    console.error(childProcess.error);
    return false;
  }

  /**
   * @param {String} packagePath
   * @param {DeskproApiClient} authenticatedClient
   * @return {Promise.<*>}
   */
  runDeploy (packagePath, authenticatedClient)
  {
    const packageBuffer = fs.readFileSync(packagePath, { flag: 'r' });

    return authenticatedClient.apps(packageBuffer)
      .then(function (result) {
        return result;
      })
      .catch(function (result) {
        console.log(result);
        throw new Error('failed to deploy');
      });
  }

  /**
   * Starts a development server serving from <path> if path is a valid app project directory
   *
   * @param {String} projectRoot
   * @param {Object} runConfig
   * @returns {boolean}
   */
  startDevServer(projectRoot, runConfig)
  {
    if (! this.validateProjectDirectory(projectRoot)) {
        return false;
    }
    const {webpackDev, webpackConfig, modulePaths} = runConfig;

    const localConfig = path.resolve(projectRoot, "src", "webpack", "webpack.config-development.js");
    const runtimeConfig = fs.existsSync(localConfig) ? localConfig : webpackConfig;
    const args = ['--config', runtimeConfig, '--env.DP_PROJECT_ROOT', projectRoot];

    let nodePath;
    if (process.env.NODE_PATH) {
      nodePath = process.env.NODE_PATH.split(path.delimiter).concat(modulePaths).join(path.delimiter);
    } else {
      nodePath = modulePaths.join(path.delimiter);
    }
    const env = { DP_PROJECT_ROOT: projectRoot, NODE_PATH: nodePath };
    const runtimeEnv = Object.assign({}, process.env, env);

    const devServer = spawn(webpackDev, args, { cwd: projectRoot, stdio: 'inherit', env: runtimeEnv });

    devServer.on('exit', (code) => { console.log(`dpat server exited with code ${code}`); });
    return true;
  }
}

module.exports = DeskproProject;
