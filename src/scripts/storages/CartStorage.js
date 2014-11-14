'use strict';

var _ = require('lodash');
var $ = require('jquery');

function CartStorage() {
  this.storage = window.localStorage;
  this.products = [];
  this.storageKey = 'cart';
  this.onItemsCountChangeCallbacks = [];
}

CartStorage.prototype = {
  addProduct: function(data) {
    var items = this.getItems();
    var index = _.findIndex(items, function(item) {
      return item.product.id == data.product.id;
    });
    if (index > -1) {
      items[index].quantity += parseInt(data.quantity, 10);
    } else {
      items.push(data);
    }
    data = JSON.stringify({
      items: items
    });
    this.storage.setItem(this.storageKey, data);
    _.each(this.onItemsCountChangeCallbacks, function(callback) {
      callback();
    });
  },
  getItems: function() {
    var products = JSON.parse(this.storage.getItem(this.storageKey));
    return products ? products.items : [];
  },
  getProductsCount: function() {
    var count = _.size(this.getItems());
    return count;
  },
  setQuantityForProduct: function(productId, quantity) {
    quantity = parseInt(quantity, 10);
    if (quantity < 1) return;
    var items = this.getItems();
    var index = _.findIndex(items, function(item) {
      return item.product.id == productId;
    });
    items[index].quantity = quantity;
    var data = {
      items: items
    };
    data = JSON.stringify(data);
    this.storage.setItem(this.storageKey, data);
  },
  removeProduct: function(productId) {
    var items = this.getItems();
    var index = _.findIndex(items, function(item) {
      return item.product.id == productId;
    });
    if (index > -1) {
        items.splice(index, 1);
    }
    var data = {
      items: items
    };
    data = JSON.stringify(data);
    this.storage.setItem(this.storageKey, data);
    _.each(this.onItemsCountChangeCallbacks, function(callback) {
      callback();
    });
  },
  onItemsCountChange: function(callback) {
    this.onItemsCountChangeCallbacks.push(callback);
  },
};

module.exports = new CartStorage();
