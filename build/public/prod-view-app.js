(function() {
  var get, getCell, getRgb, prepareProductView;

  if (window.XMLHttpRequest === void 0) {
    window.XMLHttpRequest = function() {
      var e;
      try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch (_error) {
        e = _error;
        try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (_error) {
          e = _error;
          return new Error("XMLHttpRequest is not supported");
        }
      }
    };
  }

  get = function(url, callback) {
    var request;
    request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
      var response;
      if (request.readyState === 4 && (request.status >= 200 && request.status < 400)) {
        response = JSON.parse(request.responseText);
        if (response.errorCode === "OK") {
          return callback(response.result);
        }
      }
    };
    return request.send(null);
  };

  getRgb = function(variance) {
    var hue;
    hue = Math.abs(variance);
    if (variance < 0) {
      return "rgb(255, " + (225 - hue) + ", " + (225 - hue) + ")";
    }
    if (hue < 50) {
      return "rgb( " + (255 - (hue * 5)) + ", 255, " + (255 - (hue * 5)) + ")";
    }
    return "rgb(0, " + (200 - Math.min(150, hue)) + ", 0)";
  };

  getCell = function(oProduct, competitor) {
    var store, tdE, variance;
    tdE = document.createElement("td");
    store = oProduct[competitor] || {};
    if (store.price) {
      variance = Math.floor(store.variance);
      tdE.innerHTML = "" + (Math.floor(store.price)) + " $ (" + variance + ")";
      tdE.style.backgroundColor = getRgb(variance);
    } else {
      tdE.innerHTML = " ";
    }
    return tdE;
  };

  prepareProductView = function(data) {
    var rowE, tableE, thE;
    tableE = document.getElementById("productVarianceTable");
    rowE = document.createElement("tr");
    thE = document.createElement("th");
    rowE.appendChild(thE);
    data.competitors.forEach(function(competitor) {
      thE = document.createElement("th");
      thE.innerHTML = competitor;
      return rowE.appendChild(thE);
    });
    tableE.appendChild(rowE);
    data.products.forEach(function(oProduct) {
      var tdE;
      rowE = document.createElement("tr");
      tdE = document.createElement("td");
      tdE.innerHTML = oProduct.name;
      rowE.appendChild(tdE);
      data.competitors.forEach(function(competitor) {
        return rowE.appendChild(getCell(oProduct, competitor));
      });
      return tableE.appendChild(rowE);
    });
  };

  get("/rest/1.0/productVariance", prepareProductView);

}).call(this);
