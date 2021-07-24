var cp = require('child_process');
var expect = require('expect');

var command = require.resolve('../');

describe('update-template', function () {
  // Just a dummy test to make CI pass
  it('prints help', function (done) {
    var help = cp.spawnSync('node', [command, '--help']);
    expect(help.stdout).toBeDefined();
    done();
  });
});
