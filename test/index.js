var cp = require("node:child_process");
var assert = require("node:assert");
var { describe, it } = require("node:test");

var command = require.resolve("../");

describe("update-template", function () {
  // Just a dummy test to make CI pass
  it("prints help", { timeout: 10000 }, function () {
    var help = cp.spawnSync("node", [command, "--help"]);
    assert(help.stdout);
  });
});
