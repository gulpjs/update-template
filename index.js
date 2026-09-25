#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { parseArgs } from "node:util";

import yaml from "js-yaml";
import { Semver } from "sver";
import remoteGitTags from "remote-git-tags";
import boilerplateUpdate from "boilerplate-update";

import packageJSON from "./package.json" with { type: "json" };

const REMOTE_URL = "https://github.com/gulpjs/.boilerplate";

function trimV(tag) {
  return tag[0] === "v" ? tag.slice(1) : tag;
}

// This function makes assumption about the layout of .boilerplate
// at specific tags to determine a starting point for updating
async function guessStartTag() {
  // `.jscsrc` was used before we added Azure Pipelines
  if (fs.existsSync(".jscsrc")) {
    return "1.0.0";
  }

  // `.ci` was added to support Azure Pipelines
  if (fs.existsSync(".ci")) {
    return "2.0.0";
  }

  // If we are in the 3.x release stream, tiny changes were made to the workflow.yml
  try {
    const devFile = fs.readFileSync(".github/workflows/dev.yml", "utf-8");
    const workflow = yaml.safeLoad(devFile);

    // We started 3.0.0 with `on: [push, pull_request]` but quickly changed
    // to avoid running the workflow on pushing tags
    if (Array.isArray(workflow.on)) {
      return "3.0.0";
    }

    // In 3.0.1, we didn't check that the event was a push and that failed PRs
    if (workflow.jobs.prettier && !workflow.jobs.prettier.if) {
      return "3.0.1";
    }

    const { default: pkg } = await import(
      path.join(process.cwd(), "package.json"),
      {
        with: { type: "json" },
      }
    );

    // In 3.0.2, we updated the node version in package.json but forgot to remove some unused files
    if (pkg.engines.node === ">=10.13.0") {
      const hasEslintignore = fs.existsSync(".eslintignore");

      // We forgot to remove .eslintignore and some other files so we check for that
      if (hasEslintignore) {
        return "3.0.2";
      }
    }

    const hasReleaseWorkflow = fs.existsSync(".github/workflows/release.yml");
    // In 3.1.0, we add the release.yml workflow file
    if (!hasReleaseWorkflow) {
      return "3.0.3";
    }

    const hasNpmrc = fs.existsSync(".npmrc");
    if (hasReleaseWorkflow && hasNpmrc) {
      return "3.1.0";
    }

    // 4.0.0 had a bug with repository metadata in package.json
    return "4.0.1";
  } catch (err) {
    // Always fallback to 1.0.0
    return "1.0.0";
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

const options = {
  help: {
    type: "boolean",
    short: "h",
    describe: "Show help",
    spacing: 5,
  },
  version: {
    type: "boolean",
    short: "v",
    describe: "Show version number",
    spacing: 2,
  },
  "start-tag": {
    type: "string",
    short: "s",
    describe: "Git tag of starting template (guessed if empty)",
    spacing: 0,
  },
  "end-tag": {
    type: "string",
    short: "s",
    describe: "Git tag of ending template (guessed if empty)",
    spacing: 2,
  },
};

async function guessTags(values) {
  let startTag = values["start-tag"];
  if (!startTag) {
    startTag = await guessStartTag();
    console.log(`Guessed start-tag: ${startTag}`);
  } else {
    startTag = trimV(startTag);
  }

  let endTag = values["end-tag"];
  if (!endTag) {
    endTag = await guessEndTag();
    console.log(`Guessed end-tag: ${endTag}`);
  } else {
    endTag = trimV(endTag);
  }

  return {
    startTag,
    endTag,
  };
}

async function run(values) {
  if (values.help) {
    let help = `update-template

  Update a gulp repository to our template.

  Options:`;
    for (const [flag, config] of Object.entries(options)) {
      const leadingSpaces = Array.from(Array(config.spacing), () => " ").join(
        "",
      );
      const trailingSpaces = config.type == "boolean" ? "" : " ";
      help += "\n";
      help += `  --${flag}, -${config.short} ${leadingSpaces}[${config.type}]${trailingSpaces} ${config.describe}`;
    }
    console.log(help);
    return;
  }

  if (values.version) {
    console.log(packageJSON.version);
    return;
  }

  const { startTag, endTag } = await guessTags(values);

  if (!startTag) {
    return Promise.reject("--start-tag is required & couldn't be guessed");
  }

  if (!endTag) {
    return Promise.reject("--end-tag is required & couldn't be guessed");
  }

  if (startTag === endTag) {
    console.log(`Tags match (${startTag}), nothing to apply`);
    return;
  }

  var { promise: boilerplateUpdatePromise } = await boilerplateUpdate({
    remoteUrl: REMOTE_URL,
    startVersion: startTag,
    endVersion: endTag,
    resolveConflicts: {
      stdio: "inherit",
    },
    wasRunAsExecutable: true,
  });

  await boilerplateUpdatePromise;

  if (endTag === "4.0.1") {
    console.log("fixing npm package...");
    execSync("npm pkg fix");
    console.log("updating lockfile...");
    execSync("npm install --package-lock-only");
    console.warn("you probably want to run `npm ci && npm run format-write`");
  }
}

try {
  const { values } = parseArgs({ options, strict: true });
  await run(values);
} catch (err) {
  if (err.message) {
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
}
