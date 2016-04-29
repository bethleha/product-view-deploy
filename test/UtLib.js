(function() {
  var BASE_URL, MongoClient, UtLib, errorCode, exec, mime, noop, rest;

  rest = require("rest");

  mime = require('rest/interceptor/mime');

  errorCode = require('rest/interceptor/errorCode');

  exec = require("child_process").exec;

  MongoClient = require("mongodb").MongoClient;

  BASE_URL = "http://" + (process.env.SERVER_HOST || 'localhost') + ":" + (process.env.PORT || 3000) + "/rest/1.0";

  noop = function() {};

  UtLib = {
    testSetupInit: function(done) {
      var config;
      config = require("../build/nodeapp/config");
      return MongoClient.connect(config.mongoUrl, function(err, db) {
        var IMPORT_CMD;
        if (err) {
          return done(err);
        }
        IMPORT_CMD = "mongoimport --db " + config.db + " --collection " + config.coll + " --type csv --headerline";
        UtLib.db = db;
        UtLib.nodeapp = require("../build/nodeapp");
        return exec("" + IMPORT_CMD + " --file " + __dirname + "/data/sample-data.csv", done);
      });
    },
    testSetupDeinit: function(done) {
      var productsColl;
      if (UtLib._server) {
        UtLib._server.removeAllListeners();
        return UtLib._server.close();
      }
      productsColl = UtLib.db.collection("products");
      return productsColl.drop(function(err) {
        if (err) {
          return done(err);
        }
        return UtLib.db.close(true, done);
      });
    },
    _getRequest: function(url, method, data) {
      var body;
      body = {
        requests: []
      };
      if (data.length) {
        data.forEach(function(req) {
          return body.requests.push(req);
        });
      } else {
        body.requests.push(data);
      }
      return {
        path: url,
        method: method,
        entity: body
      };
    },
    _serverTalk: function(request, next) {
      var client, failCb, successCb;
      client = rest.wrap(mime, {
        mime: 'application/json'
      }).wrap(errorCode, {
        code: 400
      });
      successCb = function(resp) {
        var data;
        data = {};
        if (resp.entity) {
          if (resp.headers['Content-Type'] !== 'application/json') {
            data = JSON.parse(resp.entity);
          } else {
            data = resp.entity;
          }
        }
        if (resp.status.code === 200 || resp.status.code === 201 || resp.status.code === 204) {
          return next(null, data);
        }
        return next(data);
      };
      failCb = function(resp) {
        if (resp.entity && resp.entity.errors) {
          return next(resp.entity.errors);
        }
        return next(new Error("Error: Server Talk Failed !!!"), resp.entity);
      };
      return client(request).then(successCb, failCb);
    },
    testTalk: function(next) {
      var request;
      request = UtLib._getRequest("" + BASE_URL + "/ping");
      UtLib._serverTalk(request, next);
    },
    calculateVariance: function(next) {
      var request;
      request = UtLib._getRequest("" + BASE_URL + "/productVariance");
      UtLib._serverTalk(request, next);
    },
    importCsv: function(path, next) {
      var IMPORT_CMD, config;
      config = require("../build/nodeapp/config");
      IMPORT_CMD = "mongoimport --db " + config.db + " --collection " + config.coll + " --type csv --headerline";
      console.log("       === Importing ... : " + path);
      return exec("" + IMPORT_CMD + " --file " + path, function(err) {
        if (err) {
          console.error(err, err.stack);
          return (next || noop)(err);
        }
        console.log("       === Import Complete  : " + path);
        return (next || noop)();
      });
    }
  };

  module.exports = UtLib;

}).call(this);
