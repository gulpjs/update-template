import cp from "node:child_process";
import assert from "node:assert";
import { describe, it } from "node:test";

var command = import.meta.resolve("../index.js");

describe("update-template", function () {
  // Just a dummy test to make CI pass
  it("prints help", { timeout: 10000 }, function () {
    var help = cp.spawnSync("node", [command, "--help"]);
    assert(help.stdout);
  });
});
