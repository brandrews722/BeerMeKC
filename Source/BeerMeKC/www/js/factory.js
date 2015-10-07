/**
 * Created by Jordan on 10/3/2015.
 */

var baseBreweryDBUrl = 'http://api.brewerydb.com/v2';
var breweryDBKey = 'key=a309a2bb50885577a0bb30ec5a049289';
var bMKCUrl = 'http://localhost:8100';

/**
 * Factory implementation provided by "Learning Ionic" - Arvind Ravulavaru, PACKT Publishing
 */
angular.module('BeerMeKC.factory', [])

  .factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {
    var LOADERAPI = {
      showLoading: function(text) {
        text = text || 'Loading...';
        $ionicLoading.show({
          template: text
        });
      },

      hideLoading: function() {
        $ionicLoading.hide();
      },

      toggleLoadingWithMessage: function(text, timeout) {
        $rootScope.showLoading(text);

        $timeout(function() {
          $rootScope.hideLoading();
        }, timeout || 3000);
      }

    };
    return LOADERAPI;
  }])

/**
 * Local Storage factory
 */
  .factory('LSFactory', [function() {

    var LSAPI = {

      clear: function() {
        return localStorage.clear();
      },

      get: function(key) {
        return JSON.parse(localStorage.getItem(key));
      },

      set: function(key, data) {
        return localStorage.setItem(key, JSON.stringify(data));
      },

      delete: function(key) {
        return localStorage.removeItem(key);
      },

      getAllBeers: function() {
        var beers = [];
        var items = Object.keys(localStorage);

        for (var i = 0; i < items.length; i++) {
          if (items[i] !== 'user' || items[i] != 'token') {
            beers.push(JSON.parse(localStorage[items[i]]));
          }
        }

        return beers;
      }

    };

    return LSAPI;

  }])

/**
 * Authentication factory
 * Depends on LSFactory
 */
  .factory('AuthFactory', ['LSFactory', function(LSFactory) {

    var userKey = 'user';
    var tokenKey = 'token';

    var AuthAPI = {

      isLoggedIn: function() {
        return this.getUser() === null ? false : true;
      },

      getUser: function() {
        return LSFactory.get(userKey);
      },

      setUser: function(user) {
        return LSFactory.set(userKey, user);
      },

      getToken: function() {
        return LSFactory.get(tokenKey);
      },

      setToken: function(token) {
        return LSFactory.set(tokenKey, token);
      },

      deleteAuth: function() {
        LSFactory.delete(userKey);
        LSFactory.delete(tokenKey);
      }

    };

    return AuthAPI;

  }])

/**
 *
 * Depends on AuthFactory
 */
  .factory('TokenInterceptor', ['$q', 'AuthFactory', function($q, AuthFactory) {

    return {
      request: function(config) {
        config.headers = config.headers || {};
        var token = AuthFactory.getToken();
        var user = AuthFactory.getUser();

        if (token && user) {
          config.headers['X-Access-Token'] = token.token;
          config.headers['X-Key'] = user.email;
          config.headers['Content-Type'] = "application/json";
        }
        return config || $q.when(config);
      },

      response: function(response) {
        return response || $q.when(response);
      }
    };

  }])

  .factory('BeersForBreweryFactory', ['$http', function($http) {
    var API = {
      get: function(breweryId) {
        return $http.get(baseBreweryDBUrl + '/brewery/' + breweryId + '/beers?' + breweryDBKey);
      }
    };
    return API;
  }])

  .factory('UserFactory', ['$http', 'AuthFactory',
    function($http, AuthFactory) {

      var UserAPI = {

        login: function(user) {
          $.post(bMKCUrl + '/login', user);
        },

        register: function(user) {
          $.post(bMKCUrl + '/register', user);
        },

        logout: function() {
          AuthFactory.deleteAuth();
        }

        //addToLikedBeers: function(beer) {
        //  var userId = AuthFactory.getUser()._id;
        //  return $http.post(bMKCUrl + '/users/' + userId + '/beers', beer);
        //},
        //
        //getLikedBeers: function() {
        //  var userId = AuthFactory.getUser()._id;
        //  return $http.get(bMKCUrl + '/users/' + userId + '/beers');
        //}

        //addDestination: function(cart) {
        //  var userId = AuthFactory.getUser()._id;
        //  return $http.post(bMKCUrl + '/users/' + userId + '/destination');
        //}

      };

      return UserAPI;
    }
  ])

