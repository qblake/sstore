'use strict';

var Q = require('q');
var $ = require('jquery');
var Config = require('../lib/config');

function ProductsService() {
}

ProductsService.prototype = {
  loadProductsInCategory: function(categoryId) {
    return Q(
      $.ajax({
        url: Config.backendHost + Config.backendApiPrefix + Config.storeId + '/products?category=' + categoryId,
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(response) {
          return response;
        },
      })
    ).then(function(data){
      return data;
    })
    .fail(function(data) {
      console.error('Can\'t load products:', data.status, data.statusText);
    });
  },
  loadProduct: function(productId) {
    return Q(
      $.ajax({
        url: Config.backendHost + Config.backendApiPrefix + Config.storeId + '/product?id=' + productId,
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(response) {
          return response;
        },
      })
    ).then(function(data){
      return data;
    })
    .fail(function(data) {
      console.error('Can\'t load product:', data.status, data.statusText);
    });
  },
};

module.exports = new ProductsService();
