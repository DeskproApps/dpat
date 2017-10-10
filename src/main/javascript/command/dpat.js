#!/usr/bin/env node

const program = require("commander");

program
    .version("0.1.0", "-V, --version")
    .command("validate <manifest>", "validates an application manifest")
    .command("new <path>", "creates a new application project in the folder specified by <path>")
    .command("server <path>", "starts a local http server that can run and test an application stored at <path>")
    .command("package <path>", "compiles, bundles and packages the application repository stored at [path] for distribution and release")
    .command("compile <path>", "compiles the application repository stored at [path]")
    .command("bundle-installer <path>", "compiles the installer for the application stored at [path]")
    .command("verify <path>", "verifies the distribution folder specified by [path] is valid")
    .command("clean <path>", "removes any previous build output")
    .command("test <path>", "runs the project's tests")
    .command("deploy [path] <instance>", "packages a distribution and deploys the package to a deskpro instance")
    .parse(process.argv);
