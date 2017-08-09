## Upcoming
* [FEATURE] add dpat test command to help with running tests
* [MAINTENANCE] add dpat's node_modules dir to NODE_PATH env variable  

## v0.4.11 - 2017-08-02
* [MAINTENANCE] add travis publishing options to package.json 

## v0.4.10 - 2017-08-02
* [MAINTENANCE] enable travis automated builds and deploys
* [MAINTENANCE] make all dependencies run-time dependencies to be able to run jest tests directly when dpat is installed 

## v0.4.9 - 2017-07-20
* [FIX] dpat failure to run on travis ci because of incomplete environment in spawned child processes

## v0.4.8 - 2017-07-19
* [FIX] add missing state key schema definitions

## v0.4.7 - 2017-07-19
* [ADDITION] add validation using schema for the state access rules entry from the app's manifest

## v0.4.6 - 2017-07-11
* [FIX] Development server fails to start due to missing return value

## v0.4.5 - 2017-07-11
* [MAINTENANCE] update links after transferring the repository to the `Deskpro` organization
* [MAINTENANCE] enable travis ci integration

## v0.4.4 - 2017-07-06
* [FIX] The algorithm that resolves the source for the application manifest does not choose manifest.json when that file is present

## v0.4.3 - 2017-06-30
* [FIX] Manifest validation error prevents dev server from starting

## v0.4.2 - 2017-06-29

* [FEATURE] Use deskpro key in package.json to generate app manifest
* [MAINTENANCE] Improved error messages from cli commands
  
## v0.4.1 - 2017-06-29

* [MAINTENANCE] Version bump due to previous version blocked by npm (un-published)  

## v0.4.0 - 2017-06-29

* [FIX] Webpack executables not found if dpat installed globally
* [FEATURE] Add new build module which exports all the tools for building apps

## v0.3.4 - 2017-06-13

* [FIX] Failure to resolve dpat root path 
* [FIX] In dev mode, copy sdk distributions only if they have been added as dependencies 

## v0.3.3 - 2017-06-13

* [FEATURE] Add options to resolve babel plugins and presets relative to dpat installation root
* [FEATURE] Add possibility to collect all dependencies from package.json in a vendor bundle
* [MAINTENANCE] Adjust webpack build scripts  

## v0.3.2 - 2017-06-12

* [FEATURE] Add more build commands
* [MAINTENANCE] Add more webpack plugins

## v0.3.1 - 2017-05-22

* [FIX] fix app manifest validation

## v0.3.0 - 2017-05-16

* [FIX] Fail packaging, compiling and deploying with a descriptive error if node_modules folder is missing
* [FEATURE] Add `dpat compile` command


## v0.2.3 - 2017-05-02

* [FIX] Use published version of deskproapps-sdk-react

## v0.2.2 - 2017-04-28

* [FIX] Resolving deskpro react sdk in webpack configuration is using wrong file paths
* [FEATURE] Distribution assets use standard file names

## v0.2.1 - 2017-04-27

* Allow projects to override the webpack configuration for distribution and development
* Enable CORS for development server
* Added first online documentation

## v0.2.0 - 2017-04-24

* Add package and deploy commands

## v0.1.0 - 2017-04-24

* Initial public release