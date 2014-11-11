'use strict';

// var RequestHelper = require('../helpers/RequestHelper');
var Q = require('q');
var $ = require('jquery');

function CategoriesService() {
}

CategoriesService.prototype = {
  loadRootCategories: function() {
    return this.loadCategories(0);
  },

  loadCategories: function(parentId) {
    return Q(
      $.ajax({
        url: 'http://appdev.ecwid.com/api/v1/6978003/categories?parent=' + parentId,
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(response) {
          console.log('response', response);
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
