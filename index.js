#!/usr/bin/env node

const fs = require(`fs`);
const path = require(`path`);
const yaml = require(`js-yaml`);
const yargs = require(`yargs`);
const { Semver } = require(`sver`);
const remoteGitTags = require(`remote-git-tags`);
const boilerplateUpdate = require(`boilerplate-update`);

const REMOTE_URL = `git://github.com/gulpjs/.boilerplate`;

function trimV(tag) {
  return tag[0] === `v` ? tag.slice(1) : tag;
}

// This function makes assumption about the layout of .boilerplate
// at specific tags to determine a starting point for updating
function guessStartTag() {
  // `.jscsrc` was used before we added Azure Pipelines
  if (fs.existsSync(`.jscsrc`)) {
    return `1.0.0`;
  }

  // `.ci` was added to support Azure Pipelines
  if (fs.existsSync(`.ci`)) {
    return `2.0.0`;
  }

  // If we are in the 3.x release stream, tiny changes were made to the workflow.yml
  try {
    const devFile = fs.readFileSync(`.github/workflows/dev.yml`, `utf-8`);
    const workflow = yaml.safeLoad(devFile);

    // We started 3.0.0 with `on: [push, pull_request]` but quickly changed
    // to avoid running the workflow on pushing tags
    if (Array.isArray(workflow.on)) {
      return `3.0.0`;
    }

    // In 3.0.1, we didn`t check that the event was a push and that failed PRs
    if (!workflow.jobs.prettier.if) {
      return `3.0.1`;
    }

    const pkg = require(path.join(process.cwd(), `package.json`));

    // In 3.0.2, we updated the node version in package.json but forgot to remove some unused files
    if (pkg.engines.node === `>=10.13.0`) {
      const hasEslintignore = fs.existsSync(`.eslintignore`);

      // We forgot to remove .eslintignore and some other files so we check for that
      if (hasEslintignore) {
        return `3.0.2`;
      }
    }

    const releaseWorkflow = fs.existsSync(`.github/workflows/release.yml`);
    // In 3.1.0, we add the release.yml workflow file
    if (!releaseWorkflow) {
      return `3.0.3`;
    }

    return `3.1.0`;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function guessEndTag() {
  const tags = await remoteGitTags(REMOTE_URL);
  const versions = [];

  for (const tag of tags.keys()) {
    // Trim a leading `v` from the tag
    const version = trimV(tag);
    versions.push(version);
  }

  // Sort the versions and pop off the last (newest) one
  return versions.sort(Semver.compare).pop();
}

function opts(yargs) {
  yargs.option(`start-tag`, {
    alias: `s`,
    describe: `Git tag of starting template (guessed if empty)`,
    type: `string`,
  });

  yargs.option(`end-tag`, {
    alias: `e`,
    describe: `Git tag of ending template (guessed if empty)`,
    type: `string`,
  });
}

async function guessTags(argv) {
  let startTag = argv.startTag;
  if (!startTag) {
    startTag = guessStartTag();
  } else {
    startTag = trimV(startTag);
  }

  let endTag = argv.endTag;
  if (!endTag) {
    endTag = await guessEndTag();
  } else {
    endTag = trimV(endTag);
  }

  return {
    startTag,
    endTag,
  };
}

async function run(argv) {
  if (!argv.startTag) {
    return Promise.reject(`--start-tag is required & couldn't be guessed`);
  }

  if (!argv.endTag) {
    return Promise.reject(`--end-tag is required & couldn't be guessed`);
  }

  var { promise: boilerplateUpdatePromise } = await boilerplateUpdate({
    remoteUrl: REMOTE_URL,
    startVersion: argv.startTag,
    endVersion: argv.endTag,
    resolveConflicts: {
      stdio: 'inherit',
    },
    wasRunAsExecutable: true,
  });

  await boilerplateUpdatePromise;
}

yargs.command(`$0`, `Update a gulp repository to our template`, opts, run, [
  guessTags,
]).argv;
