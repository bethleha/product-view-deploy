(function() {
  var UtLib, chokidar, startWatcher, watcher;

  chokidar = require("chokidar");

  UtLib = require("./UtLib");

  startWatcher = function() {
    console.log("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log("   ~~~~~~~~~~~~ Data dir watcher runing ~~~~~~~~~~~~");
    return console.log("   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  };

  watcher = chokidar.watch("" + __dirname + "/data", {
    ignored: /[\/\\]\./,
    persistent: true
  });

  watcher.on("add", function(path) {
    return UtLib.importCsv(path);
  });

  module.exports = {
    start: startWatcher
  };

}).call(this);
