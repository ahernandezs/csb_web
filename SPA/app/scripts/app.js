var app = angular.module('spaApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'infinite-scroll',
  'ngTable',
  'ui.router',
  'uiGmapgoogle-maps',
  'ngScrollbars',
  'ngDialog',
  'angular-carousel'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'uiGmapGoogleMapApiProvider', 'ScrollBarsProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, uiGmapGoogleMapApiProvider, ScrollBarsProvider) {

  ScrollBarsProvider.defaults = {
    scrollButtons: {
        scrollAmount: 'auto',
        enable: true
      },
      scrollInertia: 400,
      axis: 'yx',
      theme: 'minimal-dark',
      autoHideScrollbar: true
    };

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAMjg5ItWNxU2f-uw6tOz3lFBe_tXcUwlM',
    v: '3.17',
    libraries: 'places,geometry,visualization'
  });

  $urlRouterProvider.otherwise('/login');
  $httpProvider.interceptors.push('httpInterceptor');

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'views/login2.html',
      controller: 'Login2Ctrl'
    })

    .state('map',{
      url: '/map',
      templateUrl: 'views/map.html',
      controller: 'MapCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    })

    .state('contacto',{
      url: '/contacto',
      templateUrl: 'views/contact.html',
      controller: 'ContactCtrl'
    })

    .state('dashboard', {
      abstract: true,
      url: '/',
      templateUrl: 'views/dashboard.html',
      controller: 'DashBoardCtrl'
    })

    .state('dashboard.accounts', {
      url: 'accounts',
      views: {
        'accountContent' : {
          templateUrl: 'views/accounts.html',
          controller: 'AccountsCtrl'
        }
      }
    })

    .state('dashboard.transfers', {
      url: 'transfers',
      views: {
        'transferContent' : {
          templateUrl: 'views/transfers.html',
          controller: 'TransfersCtrl'
        }
      }
    })

    .state('dashboard.investments', {
      url: 'investments',
      views: {
        'investmentsContent' : {
          templateUrl: 'views/portfolio.html',
          controller: 'PortfolioCtrl'
        }
      }
    })

    .state('dashboard.administration', {
      url: 'administration',
      params: {
        opt : 1
      },
      views: {
        'administrationContent' : {
          templateUrl: 'views/administration.html',
          controller: 'AdminCtrl'
        }
      }
    })

    .state('dashboard.accounts.creditcard', {
      url: '/:accountId/tdc',
      views:{
        'detailCreditCard' : {
          templateUrl: 'views/partials/cards/cards.html',
          controller: 'creditCardCtrl'
        }
      }
    })

    .state('dashboard.accounts.investment', {
      url: '/:accountId/investment',
      views:{
        'detailInvestment' : {
          templateUrl: 'views/partials/investment/investments.html',
          controller: 'InvestmentsCtrl'
        }
      }
    })

    .state('dashboard.accounts.deposit', {
      url: '/:accountId/deposit',
      views:{
        'detailDeposit' : {
          templateUrl: 'views/partials/deposit/deposit.html',
          controller: 'AccountDepositDetailCtrl'
        }
      }
    })

    .state('dashboard.accounts.credit', {
      url: '/:accountId/credit',
      views:{
        'detailCredit' : {
          templateUrl: 'views/partials/credits/credit.html',
          controller: 'creditCtrl'
        }
      }
    });
   }]);

app.run(['api', '$window', '$rootScope','$templateCache', function(api, $window, $rootScope,$templateCache) {
  api.config();
  api.init();

  $rootScope.requestStack = [];

  $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });

  $window.onbeforeunload = function(e) {
    e = e || $window.event;
    e.preventDefault = true;
    e.cancelBubble = true;
    if($rootScope.session_token) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", $rootScope.restAPIBaseUrl+"/logout", false);
      xhttp.setRequestHeader('X-AUTH-TOKEN', $rootScope.session_token);
      xhttp.setRequestHeader('X-BANK-TOKEN', 4);
      xhttp.setRequestHeader('X-CLIENT-TYPE', 'WEB');
      xhttp.send();
    }
    return;
  };
}]);
