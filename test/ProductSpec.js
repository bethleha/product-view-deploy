(function() {
  var ERROR, OK, UtLib, assert, noop, routeUtil;

  process.env.NODE_ENV = "test";

  assert = require("chai").assert;

  UtLib = require("./UtLib");

  routeUtil = require("../build/nodeapp/route-util");

  OK = "OK";

  ERROR = "ERROR";

  noop = function() {};

  describe("Products Spec/ ", function() {
    before(function(done) {
      return UtLib.testSetupInit(done);
    });
    after(function(done) {
      return UtLib.testSetupDeinit(done);
    });
    describe("Unit Test", function() {
      return it("Should Calulate Product Variance", function(done) {
        var req, res, verifyCb;
        verifyCb = function(resp) {
          assert.equal(resp.errorCode, OK);
          assert.isObject(resp.result);
          assert.isArray(resp.result.competitors);
          assert.isArray(resp.result.products);
          return done();
        };
        req = {
          db: UtLib.db
        };
        res = {
          send: verifyCb
        };
        return routeUtil.calculateVariance(req, res);
      });
    });
    return describe("GUI Integration Test", function() {});
  });

}).call(this);
