## Upcoming

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