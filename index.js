#!/usr/bin/env node

var boilerplateUpdate = require(`boilerplate-update`);

async function run() {
  var {
    promise: boilerplateUpdatePromise,
    resolveConflictsProcess
  } = await boilerplateUpdate({
    remoteUrl: `git://github.com/gulpjs/.boilerplate`,
    startVersion: `2.0.0`,
    endVersion: `3.0.1`,
    resolveConflicts: true,
    wasRunAsExecutable: true,
  });

  // TODO: I don't know what to do with the resolveConflictsProcess

  await boilerplateUpdatePromise;
}

run().catch(console.error);
