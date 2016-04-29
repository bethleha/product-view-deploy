(function() {
  var ERROR, MY_STORE, OK, ProductQuery, util;

  ERROR = "ERROR";

  OK = "OK";

  MY_STORE = "My Store";

  ProductQuery = {
    variance: [
      {
        $group: {
          _id: {
            categ: "$Top Level Category",
            store: "$Store"
          },
          price: {
            $avg: "$Price"
          }
        }
      }, {
        $sort: {
          "_id.store": -1,
          "_id.categ": 1
        }
      }, {
        $group: {
          _id: "$_id.categ",
          store: {
            $push: {
              name: "$_id.store",
              price: "$price"
            }
          }
        }
      }
    ]
  };

  util = {
    calculateVariance: function(req, res, next) {
      var productsColl;
      productsColl = req.db.collection("products");
      return productsColl.aggregate(ProductQuery.variance).toArray(function(err, results) {
        var competitor, products;
        if (err) {
          return res.send({
            errorCode: ERROR,
            msg: err.message
          });
        }
        competitor = {};
        products = results.map(function(result) {
          var i, myStore, oStore, product, _i, _len, _ref;
          product = {};
          product.name = result._id;
          _ref = result.store;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            oStore = _ref[i];
            if (oStore.name === MY_STORE) {
              myStore = result.store.splice(i, 1)[0];
              break;
            }
          }
          result.store.forEach(function(oStore) {
            product[oStore.name] = {
              price: oStore.price,
              variance: oStore.price - myStore.price
            };
            return competitor[oStore.name] = 1;
          });
          product[MY_STORE] = {
            price: myStore.price
          };
          return product;
        });
        return res.send({
          errorCode: OK,
          result: {
            products: products,
            competitors: Object.keys(competitor)
          }
        });
      });
    }
  };

  module.exports = util;

}).call(this);
