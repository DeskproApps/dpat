# Changelog

This project is following [Semantic Versioning](http://semver.org)

## [Unreleased][]

## [0.10.2][] - 2018-03-27

## Added

 - schema for apps manifest v2.4.0

## [0.10.1][] - 2018-03-27

### Fixed

 - webpack and webpack-dev-server executables not resolved properly when `apps-dpat` is a dependency for node versions 8 and up

## [0.10.0][] - 2018-03-08

### Added

 - new `dpat travis pr-comment` command that adds a comment with a link to the build artifact to a pull requests (only github supported at the moment)
 
 - ability to set the build artifact file name after the package name instead of using the default one 


## [0.9.7][] - 2018-02-09

- default `process.env.NODE_ENV` to `production` when packaging the app for distribution with webpack  

## [0.9.6][] - 2017-11-24

### Changed

 - upgrade apps-installer to v0.4.2

## [0.9.5][] - 2017-11-23

### Changed

 - upgrade apps-installer to v0.4.1

## [0.9.4][] - 2017-11-20

### Changed

 - upgrade apps-installer to v0.4.0
 - upgrade dependencies

## [0.9.3][] - 2017-11-03

### Fixed

 - incorrect path to default installer bundle
 - upgrade apps-installer to v0.3.2

## [0.9.2][] - 2017-10-27

### Fixed

 - detection of a customized app installer takes into consideration the project directory

## [0.9.1][] - 2017-10-24

### Changed

 - updates INSTALLER_VER in package.json

## [0.9.0][] - 2017-10-24

### Changed

 - renames @deskproapps references to @deskpro

## [0.8.0][] - 2017-10-11

### Added

 - add a command to bundle the default app installer together with the app

### Changed

 - regenerate npm-shrinkwrap.json

## [0.7.1][] - 2017-10-09

### Fixed

 - removed obsolete property named `enabled` from the custom field manifest definition 
 - add required property named `title` to the custom field manifest definition


## [0.7.0][] - 2017-10-05

### Added

 - support for manifest version 2.3.0 

## [0.6.0][] - 2017-09-18

### Added

 - support for validating multiple manifest versions
 - schema for manifest version 2.2.0 which renames the top-level key "state" to "storage"

### Changed

 - made `appVersion` a required key from versions 2.1.0 and up
 - SyntaxValidator returns more helpful error messages
 - changelog using [keep a changelog](http://keepachangelog.com/en/0.3.0/) format
 
## [0.5.2][] - 2017-08-09

### Added
 
 - babel support for async/await

## [v0.5.1][] - 2017-08-09

### Fixed

 - create NODE_PATH variable if not set

## [0.5.0] - 2017-08-09

### Added

 - dpat test command to help with running tests
 
### Changed

  - add dpat's node_modules dir to NODE_PATH env variable  

## [0.4.11]  - 2017-08-02

### Changed

  -  add travis publishing options to package.json 

## [0.4.10]  - 2017-08-02

### Changed

 - enable travis automated builds and deploys
 - make all dependencies run-time dependencies to be able to run jest tests directly when dpat is installed 

## [0.4.9]  - 2017-07-20

### Fixed
    - dpat failure to run on travis ci because of incomplete environment in spawned child processes

## [0.4.8]  - 2017-07-19

### Fixed
  - add missing state key schema definitions

## [0.4.7]  - 2017-07-19

### Added
 - add validation using schema for the state access rules entry from the app's manifest

## [0.4.6]  - 2017-07-11

### Fixed
  - Development server fails to start due to missing return value

## [0.4.5]  - 2017-07-11

### Added
- update links after transferring the repository to the `Deskpro` organization
- enable travis ci integration

## [0.4.4]  - 2017-07-06

### Fixed

  - The algorithm that resolves the source for the application manifest does not choose manifest.json when that file is present

## [0.4.3]  - 2017-06-30

### Fixed

  - Manifest validation error prevents dev server from starting

## [0.4.2]  - 2017-06-29

### Changed

- Use deskpro key in package.json to generate app manifest
- Improved error messages from cli commands

## [0.4.1]  - 2017-06-29

### Changed

 - Version bump due to previous version blocked by npm (un-published)  

## [0.4.0]  - 2017-06-29

### Added

 - New build module which exports all the tools for building apps

### Fixed

 - Webpack executables not found if dpat installed globally

## [0.3.4]  - 2017-06-13

### Fixed

  - Failure to resolve dpat root path 
  - In dev mode, copy sdk distributions only if they have been added as dependencies 

## [0.3.3]  - 2017-06-13

### Added

- Add options to resolve babel plugins and presets relative to dpat installation root
- Add possibility to collect all dependencies from package.json in a vendor bundle

### Changed

  - Adjust webpack build scripts  

## [0.3.2]  - 2017-06-12

### Added

 - more build commands
 - more webpack plugins

## [0.3.1]  - 2017-05-22

### Fixed

 - fix app manifest validation

## [0.3.0]  - 2017-05-16

### Added

  - Add `dpat compile` command

### Fixed

  - Fail packaging, compiling and deploying with a descriptive error if node_modules folder is missing

## [0.2.3]  - 2017-05-02

### Fixed

  - Use published version of deskproapps-sdk-react

## [0.2.2]  - 2017-04-28

### Added
  - Distribution assets use standard file names

### Fixed
 - Resolving deskpro react sdk in webpack configuration is using wrong file paths


## [0.2.1]  - 2017-04-27

### Added

- Allow projects to override the webpack configuration for distribution and development
- Enable CORS for development server
- Added first online documentation

## [0.2.0]  - 2017-04-24

### Added

 - Add package and deploy commands

## [0.1.0]  - 2017-04-24

* Initial public release

[Unreleased]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.10.2...HEAD
[0.10.2]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.10.1...v0.10.2
[0.10.1]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.7...v0.10.0
[0.9.7]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.6...v0.9.7
[0.9.6]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.5...v0.9.6
[0.9.5]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.4...v0.9.5
[0.9.4]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.3...v0.9.4
[0.9.3]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/Deskpro/deskproapps-dpat/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/Deskpro/deskproapps-dpat/tree/v0.6.0