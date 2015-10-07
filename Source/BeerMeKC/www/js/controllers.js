angular.module('BeerMeKC.controllers', [])

  .controller('AppCtrl', ['$rootScope', 'AuthFactory', '$location', 'UserFactory', 'Loader', '$scope', '$ionicModal',
    function($rootScope, AuthFactory, $location, UserFactory, Loader, $scope, $ionicModal) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      $rootScope.$on('showLoginModal', function ($event, scope, cancelCallback, callback) {
        $scope.user = {
          email: '',
          password: ''
        };

        $scope = scope || $scope;

        $scope.viewLogin = true;

        $ionicModal.fromTemplateUrl('templates/login.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.modal = modal;
          $scope.modal.show();

          $scope.switchTab = function (tab) {
            if (tab === 'login') {
              $scope.viewLogin = true;
            } else {
              $scope.viewLogin = false;
            }
          }

          $scope.hide = function () {
            $scope.modal.hide();
            if (typeof cancelCallback === 'function') {
              cancelCallback();
            }
          }

          $scope.login = function () {
            Loader.showLoading('Authenticating...');

            UserFactory.login($scope.user).success(function (data) {

              data = data.data;
              AuthFactory.setUser(data.user);
              AuthFactory.setToken({
                token: data.token,
                expires: data.expires
              });

              $rootScope.isAuthenticated = true;
              $scope.modal.hide();
              Loader.hideLoading();
              if (typeof callback === 'function') {
                callback();
              }
            }).error(function (err, statusCode) {
              Loader.hideLoading();
              Loader.toggleLoadingWithMessage(err.message);
            });
          }

          $scope.register = function () {
            Loader.showLoading('Registering...');

            UserFactory.register($scope.user).success(function (data) {

              data = data.data;
              AuthFactory.setUser(data.user);
              AuthFactory.setToken({
                token: data.token,
                expires: data.expires
              });

              $rootScope.isAuthenticated = true;
              Loader.hideLoading();
              $scope.modal.hide();
              if (typeof callback === 'function') {
                callback();
              }
            }).error(function (err, statusCode) {
              Loader.hideLoading();
              Loader.toggleLoadingWithMessage(err.message);
            });
          }
        });

      });
      $rootScope.loginFromMenu = function () {
        $rootScope.$broadcast('showLoginModal', $scope, null, null);
      }

      $rootScope.logout = function () {
        UserFactory.logout();
        $rootScope.isAuthenticated = false;
        $location.path('/app/browse');
        Loader.toggleLoadingWithMessage('Successfully Logged Out!', 2000);
      }
    }
  ])

  .controller('BrowseCtrl', ['$scope', 'BeersForBreweryFactory', 'LSFactory', 'Loader', function($scope) {

  }
    //function($scope, BeersFactory, LSFactory, Loader) {
    //  Loader.showLoading();
    //
    //  $scope.beers = [];
    //  var beers = LSFactory.getAll();
    //
    //  if (beers.length > 0) {
    //    $scope.beers = beers;
    //    Loader.hideLoading();
    //  } else {
    //    BeersForBreweryFactory.getAllBeers().success(function(data) {
    //
    //    });
    //  }
    //}
  ])

  .controller('BreweriesCtrl', function($scope) {
    $scope.breweries = [
      { name: 'Big Rip', id: 1 },
      { name: 'Cinder Block', id: 2 },
      { name: 'Boulevard', id: 3 },
      { name: 'Torn Label', id: 4 },
      { name: 'Stockyards', id: 5 },
      { name: 'Eye For An Eye', id: 6 }
    ];
  })

  .controller('BreweryCtrl', function($scope, $stateParams) {
  })

  .controller('AddBreweryCtrl', function($scope, $stateParams) {

  })
