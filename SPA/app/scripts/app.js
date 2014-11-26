'use strict';

var app = angular.module('spaApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'pubnub.angular.service',
  'infinite-scroll'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    //$httpProvider.responseInterceptors.push('httpInterceptor');

    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/accounts', {
        templateUrl: 'views/accounts.html',
        controller: 'AccountsCtrl',
        /*resolve: {
          accounts: ['accountsProvider', function(accountsProvider) {
            return accountsProvider.getAccounts();
          }]
        }*/
      })
      .when('/accounts/:accountId/transactions', {
        templateUrl: 'views/transactions.html',
        controller: 'TransactionsCtrl',
        resolve: {
          accounts: ['accountsProvider', function(accountsProvider) {
            return accountsProvider.getAccounts();
          }]
        }
      })
      .when('/administration/admin-card',{
        templateUrl: 'views/partials/admin/cards.html'
      })

      .when('/administration/contract',{
        templateUrl: 'views/partials/admin/contract.html'
      })
      
      .when('/administration/configuration',{
        templateUrl: 'views/partials/admin/configuration.html'
      })
      .when('/administration/accounts-clabe', {
        templateUrl: 'views/partials/admin/clabe.html',
        controller: 'ClabeCtrl',
        url: 'accounts-clabe',
        resolve: {
          accounts: ['accountsProvider', function(accountsProvider) {
            return accountsProvider.getAccounts();
         }]
        }
      })      
      .when('/administration/checks', {
        templateUrl: 'views/partials/admin/checks.html',
        controller: 'ChecksCtrl',
         resolve: {
          check_accounts: ['checkAccountsProvider', function(checkAccountsProvider) {
            return checkAccountsProvider.getCheckAccounts();

          }]
        }
      })
      .otherwise({
        redirectTo: '/accounts'
      });
  }]);

app.run(['api', '$window', '$rootScope', function(api, $window, $rootScope) {
  api.config();
  api.init();

  $window.onbeforeunload = function(e) {
    var message = "Te vas a salir de ABanking, ¿estás seguro?";
    e = e || $window.event;
    e.preventDefault = true;
    e.cancelBubble = true;
    if($rootScope.session_token) {
    e.returnValue = message;

    return message;
    }
  }
}]);


