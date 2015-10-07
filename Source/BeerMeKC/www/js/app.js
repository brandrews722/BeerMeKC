// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('BeerMeKC', ['ionic', 'BeerMeKC.controllers', 'BeerMeKC.factory'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .run(['$rootScope', 'AuthFactory',
    function($rootScope, AuthFactory) {
      $rootScope.isAuthenticated = AuthFactory.isLoggedIn();


      /**
       * Get a number of items from a service call. Great for future pagination purposes.
       * @param num
       * @returns {Array}
       */
      $rootScope.getNumber = function (num) {
        return new Array(num);
      }
    }
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      //authentication
      $httpProvider.interceptors.push('TokenInterceptor');
      $stateProvider

        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
        })

        .state('app.search', {
          url: '/search',
          views: {
            'menuContent': {
              templateUrl: 'templates/search.html'
            }
          }
        })

        .state('app.browse', {
          url: '/browse',
          views: {
            'menuContent': {
              templateUrl: 'templates/browse.html',
              controller: 'BrowseCtrl'
            }
          }
        })
        .state('app.breweries', {
          url: '/breweries',
          views: {
            'menuContent': {
              templateUrl: 'templates/breweries.html',
              controller: 'BreweriesCtrl'
            }
          }
        })

        .state('app.brewery', {
          url: '/breweries/:breweryId',
          views: {
            'menuContent': {
              templateUrl: 'templates/brewery.html',
              controller: 'BreweryCtrl'
            }
          }
        });

        //.state('app.favorites', {
        //  url: '/favorites',
        //  views: {
        //    'menuContent': {
        //      templateUrl: 'templates/favorites.html',
        //      controller: 'FavoritesCtrl'
        //    }
        //  }
        //})
        //
        //.state('app.achievements', {
        //  url: '/achievements',
        //  views: {
        //    'menuContent': {
        //      templateUrl: 'templates/achievements.html',
        //      controller: 'AchievementsCtrl'
        //    }
        //  }
        //})
        //
        //.state('app.add-brewery', {
        //  url: '/add-brewery',
        //  views: {
        //    'menuContent': {
        //      templateUrl: 'templates/add-brewery.html',
        //      controller:'AddBreweryCtrl'
        //    }
        //  }
        //});

        $urlRouterProvider.otherwise('/app/browse');


    }
  ])



