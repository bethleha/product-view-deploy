(function() {
  var HOST, PORT, config;

  HOST = process.env.SERVER_HOST || "localhost";

  PORT = process.env.PORT || 3000;

  config = {
    dev: {
      mongoUrl: "mongodb://localhost:27017/product_db",
      host: HOST,
      port: PORT,
      db: "product_db",
      coll: "products"
    },
    test: {
      mongoUrl: "mongodb://localhost:27017/product_test_db",
      host: HOST,
      port: PORT,
      db: "product_test_db",
      coll: "products"
    }
  };

  module.exports = config[process.env.NODE_ENV || "dev"];

}).call(this);
