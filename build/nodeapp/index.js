(function() {
  var MongoClient, app, bodyParser, config, cookieParser, express, favicon, logger, path, util;

  express = require('express');

  path = require('path');

  favicon = require('serve-favicon');

  cookieParser = require('cookie-parser');

  logger = require("morgan");

  bodyParser = require('body-parser');

  MongoClient = require('mongodb').MongoClient;

  config = require('./config');

  util = require("./route-util");

  app = express();

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: false
  }));

  app.use(cookieParser());

  app.use(logger("dev"));

  app.use(express["static"](path.join(__dirname, '../public/')));

  app.get('/rest/1.0/ping', function(req, res) {
    return res.send("PONG");
  });

  app.use(function(req, res, next) {
    return MongoClient.connect(config.mongoUrl, function(err, db) {
      if (err) {
        return next(err);
      }
      req.db = db;
      return next();
    });
  });

  app.get('/rest/1.0/productVariance', util.calculateVariance);

  app.use(function(req, res, next) {
    req.db.close();
    return next();
  });

  module.exports = app;

}).call(this);
