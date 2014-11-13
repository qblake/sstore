'use strict';

var Q = require('q');
var $ = require('jquery');
var Config = require('../lib/config');

function ProfileService() {
}

ProfileService.prototype = {
  loadProfile: function() {
    return Q(
      $.ajax({
        url: Config.backendHost + Config.backendApiPrefix + Config.storeId + '/profile',
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
      console.error('Can\'t load profile:', data.status, data.statusText);
    });
  },
};

module.exports = new ProfileService();
