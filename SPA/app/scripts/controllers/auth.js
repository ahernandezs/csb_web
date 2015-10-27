'use strict';

/**
 * login controller
 * inject a login function in the scope
 */
angular.module('spaApp')
.controller('LoginCtrl', ['$scope', '$http', '$location', 'api', '$rootScope', '$window', 'userProvider', 'timerService', 'logoutService',
    function ($scope,$http,$location, api, $rootScope, $window, userProvider, timerService, logoutService) {
  /**
   * If user has a valid session token keep him in dashboard
   */

  if($rootScope.session_token && $location.$$path === '/login') {
    $location.path('/accounts');
  }else{
    //just in case, we clean the previous user's session
    userProvider.cleanSession();
  }
  /**
   * the login function connect the Rest-API: if the response status is OK, redirect to route "accounts",
   * else put an error message in the scope
   */
  $scope.loginData = {};

  /**
   * the error boolean
   */
  $scope.incorrectData = false;

  /**
   * the flow step : 0= checkLogin, 1=login
   */
  $scope.step = 0;

  //for the loader
  $scope.checkingUser = false;
  $scope.isLogin = false;

  // When we are in login page, reset registration token
  userProvider.resetRegistrationToken();

  /**
    * cancel the authentication flow and go back to the first step
    */
  $scope.reset=function(){
    resetError();
    $scope.loginData = {};
    $scope.step = 0;
    $scope.showTimeoutAlert = false;
    $scope.showErrorLogoutAlert = false;
  }


  /************************ Navigation ***********************************/
  /**
    Function for verify if exist user
  **/
  $scope.checkUser = function(){
    resetError();
    //console.log($scope.loginData.username);
    if(!$scope.loginData.username.trim()) {
      setError('!Usuario incorrecto¡ favor de verificarlo');
    }else{
      var json = JSON.stringify({'user_login':$scope.loginData.username,'client_application_id': 'PROSA-DIG'});
      //console.log(json);
      $scope.checkingUser = true;
      $http({
        url: $scope.restAPIBaseUrl+'/checkLogin',
        method: 'POST',
        data: json,
        headers: {'Content-Type': 'application/json','X-BANK-TOKEN': '4'}
      }).
      success(function(data, status, headers) {
        $scope.step = 1;
        //console.log(data);
        $scope.client_name = data.client_name;
        $scope.images = data.images;
        $scope.checkingUser = false;
      }).
      error(function(errorObject, status) {
        //console.log("Status : ", status);
        setErrorWithStatus(status, errorObject);
        $scope.checkingUser = false;
      });

    }
  }

	/**
	 * assign image
	 */
  $scope.selectImage = function(imageId) {
    $scope.loginData.selectedImage = imageId;
  };

  /**
    Function for authenticate user through middleware
  **/
  $scope.login = function(){
    resetError();
    if(!$scope.loginData.password.trim() || !$scope.loginData.selectedImage) {
      setError('Por favor, seleccione su imagen e introduzca su contraseña');
    }else{
      if(!$scope.loginData.selectedImage) {
        setError('Por favor, seleccione una imagen');
      }else{
        $scope.isLogin = true;
        $http({
          url: $scope.restAPIBaseUrl+'/login',
          method: 'POST',
          data: JSON.stringify({'user_login':$scope.loginData.username, 'password':$scope.loginData.password,'client_application_id': 'PROSA-DIG' , 'image_id': $scope.loginData.selectedImage.toString() }) ,
          headers: {'Content-Type': 'application/json','X-BANK-TOKEN': '4'}
        }).success(
          function(data, status, headers) {
            $scope.isLogin = false;
            var token = headers('X-AUTH-TOKEN');
            $rootScope.session_token = token;
            $rootScope.last_access_date = data.last_access_date
            $rootScope.last_access_media = data.last_client_application_id;
            $rootScope.client_name = data.client_name;
            userProvider.setCurrentUser(data);
            api.init();
            displayTokenStateIfRequired(data);
            $location.path( '/accounts' );
            timerService.start();
          }
        ).error(
          function(errorObject, status) {
            //put an error message in the scope
            $scope.isLogin = false;
            //console.log("HttpStatus code : ", status);
            setErrorWithStatus(status, errorObject);
          }
        );
      }
    }
  };

  /**
   * Function for validate data before register
   */
  $scope.preRegister = function(client,contract){
      resetError();
      $scope.registering = true;
      //TODO:Veryfy with REST service if exists contract?
      userProvider.setClientId(client);
      userProvider.preRegisterUser(contract).then(
        function(data) {
          $location.path( '/register');
        },
        function(data, status) {
          setRegisterError("Ha ocurrido un error en el registro");
          $scope.registering = false;
        });
  }

  if($window.username) {
    $scope.loginData.username = $window.username;

    $scope.checkUser();

    // get errors from backend
    $scope.setLoginErrorMessages(parseInt($window.status), parseInt($window.code));
  }

  function setError(message){
    $scope.error = true;
    $scope.errorMessage = message;
  }

  function setRegisterError(message){
    $scope.registerError = true;
    $scope.errorMessage = message;
  }

  function setErrorWithStatus(status, errorObject) {
    setError('Error en el servicio, intente más tarde');
    if (status === 0 || status === 12029) {
      setError('Error, verifica tu conexión a internet');
    } else if(status === 403) {
      setError('El password o imagen son incorrectos');
    } else if(status === 404){
      setError('Error, recurso no encontrado');
    } else if(status === 409) {
      setError('Existe una sesión vigente en otra aplicación');
    } else if(status === 423) {
      setError('Usuario bloqueado');
    } else if(status === 504) {
      setError('Tiempo de respuesta excedido, por favor intente más tarde');
    } else if(status === 500) {
      var code = errorObject.code;
      var message = 'Error en el servicio, intente más tarde';
      if (code === 401) {
        message = errorObject.message;
      }
      setError(message);
    }
  }

  function resetError(){
    $scope.error = false;
    $scope.registerError = false;
    $scope.errorMessage = "";
  }

  /**
   * display the token-stae in an alert message if it is disable, locked or new
   */
  function displayTokenStateIfRequired(data){
    // if user has complete rights
    if(data.role_id == 1){
      var tokenState = data.security_token_state;
      switch(tokenState){
        case 0 :
          $scope.setServiceError('Su token no ha sido activado, debe activarlo en el panel de administración');
          break;
        case 2 :
          $scope.setServiceError('Su token está bloqueado, por favor llame al centro de atención a clientes');
          break;
        case 3 :
          $scope.setServiceError('Su token está desactivado');
          break;
        case 99 :
          $scope.setServiceError('Error técnico, no pudimos obtener el estado de tu token');
          break;
      }
    }
  }

  $scope.unblock = function(){
    $scope.step = 2;
  }


  // Review if last session was in timeout
  if(timerService.isTimeout()) {
    $scope.showTimeoutAlert = true;
  }

  if(logoutService.hasError()){
    $scope.showErrorLogoutAlert = true;

  }

  if($window.username) {
    $scope.loginData.username = $window.username;

    $scope.checkUser();

    // get errors from backend
    setErrorWithStatus(parseInt($window.status), null);
  }
}]);
