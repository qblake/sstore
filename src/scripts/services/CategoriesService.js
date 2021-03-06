'use strict';

var Q = require('q');
var $ = require('jquery');
var Config = require('../lib/config');

function CategoriesService() {
}

CategoriesService.prototype = {
  loadCategories: function(parentId) {
    return Q(
      $.ajax({
        url: Config.backendHost + Config.backendApiPrefix + Config.storeId + '/categories?parent=' + parentId,
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
      console.error('Can\'t load categories:', data.status, data.statusText);
    });
  },
};

module.exports = new CategoriesService();
