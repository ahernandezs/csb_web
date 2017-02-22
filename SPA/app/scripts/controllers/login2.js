/**
 * login controller
 * inject a login function in the scope
 */
angular.module('spaApp')
.controller('Login2Ctrl', ['$scope', '$http', '$location', 'api', '$rootScope', '$window', 'userProvider', 'timerService', 'logoutService', 'detectIE', '$interval',
    function ($scope,$http,$location, api, $rootScope, $window, userProvider, timerService, logoutService, detectIE, $interval) {
  /**
   * If user has a valid session token keep him in dashboard
   */
  /**
   * the login function connect the Rest-API: if the response status is OK, redirect to route "accounts",
   * else put an error message in the scope
   */
  $scope.loginData = {};
	$scope.unlockData = {};

  /**
   * the error boolean
   */
  $scope.incorrectData = false;

  /**
   * the flow step : 0= checkLogin, 1=login
   */
  $scope.option= 0; 
  $scope.step = 0;

  //for the loader
  $scope.checkingUser = false;
  $scope.isLogin = false;

  // When we are in login page, reset registration token
  userProvider.resetRegistrationToken();

  /**
    * cancel the authentication flow and go back to the first step, if it is a shitty browser, reload
    */
  $scope.goToLogin2=function(){
  	$scope.option=0;
  };
  $scope.goToRegister=function(){
  	$scope.option=1;
  };
  $scope.reset=function(){
    var fckie = detectIE.detect();
    if(fckie.ie && fckie.version === '10>'){
      $window.location.reload();
    }else{
      resetError();
      $scope.loginData = {};
      $scope.unlockData = {};
      $scope.step = 0;
      $scope.showTimeoutAlert = false;
      $scope.showErrorLogoutAlert = false;
    }
  };

  /************************ Navigation ***********************************/
  /**
    Function for verify if exist user
  **/
  $scope.checkUser = function(){
    resetError();
    if(!$scope.loginData.username.trim()) {
      setError('!Usuario incorrecto¡ favor de verificarlo');
    }else{
      var json = JSON.stringify({'user_login':$scope.loginData.username,'client_application_id': 'PROSA-DIG'});
      $scope.checkingUser = true;
      $http({
        url: $scope.restAPIBaseUrl+'/checkLogin',
        method: 'POST',
        data: json,
        headers: {'Content-Type': 'application/json','X-BANK-TOKEN': '4'}
      }).
      success(function(data) {
        $scope.step = 1;
        $scope.client_name = data.client_name;
        $scope.images = data.images;
        $scope.checkingUser = false;
      }).
      error(function(errorObject, status) {
        setErrorWithStatus(status, errorObject);
        $scope.checkingUser = false;
      });

    }
  };

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
            $rootScope.last_access_date = data.last_access_date;
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
    userProvider.setClientId(client);
    userProvider.preRegisterUser(contract).then(
      function() {
        $location.path( '/register');
      },
      function() {
        setRegisterError('Ha ocurrido un error en el registro');
      $scope.registering = false;
    });
  };

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
    } else if(status === 400) {
      setError('Error al crear sesión');
    } else if(status === 403) {
      if(errorObject.code === 500 || errorObject.code === 501 || errorObject.code === 502){
        setError('Error en el servicio, intente más tarde');
      }else{
        setError('El password o imagen son incorrectos');
      }
    } else if(status === 404){
      setError('Error, recurso no encontrado');
    } else if(status === 406){
      if(errorObject.code === 404){
        setError('El password no cumple con la seguridad');
      }else{
        setError('Datos no válidos');
      }
    } else if(status === 409) {
      setError('Existe una sesión vigente en otra aplicación');
    } else if(status === 501) {
      setError('Usuario no tiene el servicio de banca digital');
    } else if(status === 502) {
      setError('Usuario no instalado en las bases');
    } else if(status === 503) {
      if(errorObject.code === 305 || errorObject.code === 306 || errorObject.code === 307){
        setError(errorObject.message);
      }else{
        setError('Error en el servicio, intente más tarde');
      }
     } else if(status === 423) {
      setError('Usuario bloqueado');
    } else if(status === 504) {
      setError('Tiempo de respuesta excedido, por favor intente más tarde');
    } else if(status === 505) {
      setError('Usuario no existe en SAP');
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
    $scope.errorMessage = '';
  }

  /**
   * display the token-stae in an alert message if it is disable, locked or new
   */
  function displayTokenStateIfRequired(data){
    // if user has complete rights
    if(data.role_id === 1){
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
        default:
          break;
      }
    }
  }

  $scope.unblock = function(){
    $scope.client = "";
    $scope.contract = "";
    resetError();
    $scope.step = 2;
    $scope.selection = 0;
  };

	$scope.changeSelection = function(step) {
		$scope.selection = step;
	};

	$scope.gobackLogin = function() {
		$scope.selection = 0;
		$scope.reset();
	};

	$scope.requestChange = function() {
    userProvider.unlockUserPreRequest( $scope.unlockData.username, $scope.unlockData.folio ).
      then( function(data) {
        resetError();
        $scope.client_name2 = data.client_name;
        $scope.unlockImages = data.images;
        $scope.selection++;
      }, function(data) {
        if ( data.code === 505 )
          setError( 'No se pudo obtener el código de desbloqueo para la validación' );
        else
          setError( data.message );
      });
	};

	$scope.validatePassword = function() {
		$scope.error = false;
		$scope.invalidPassword = true;
		var fullName= $scope.clientName;
		var password = $scope.unlockData.password;
		if(password) {
			var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/g;
			if(!pattern.test(password)) {
				setError('La contraseña debe tener de 8 a 15 caracteres, contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales');
				return;
			}

			var rexUser1 = new RegExp($scope.unlockData.username, 'g');
			if(rexUser1.test(password)) {
				setError('No puede usar su id de usuario como contraseña');
				return;
			}

			var rexInstName1 = new RegExp('consubanco', 'i');
			if(rexInstName1.test(password)) {
				setError('No puede usar el nombre de la institución como contraseña');
				return;
			}

			var repeatedChars = /(.)\1{2,}/;
			if(repeatedChars.test(password)) {
				setError('No puede repetir más de tres carácteres iguales como 111 o aaa');
				return;
			}

			if(consecutivePassword(password)) {
				setError('No puede tener secuencia de caracteres como 123 o abc');
				return;
			}

      var rexNombres = new RegExp(fullName.replace(/\b\s(.|..)\b/g," ").replace(/\s+/g,"|"),'gi');
      if(rexNombres.test(password)){
        setError('La contraseña no puede contener tu nombre ni apellidos');
        return;
      }

			$scope.invalidPassword = false;
		}
	};

	function consecutivePassword(password) {
		var isConSeq = false;
		var asciiCode;
		var previousAsciiCode = 0;
		var numSeqcount = 0;

		for(var i = 0; i < password.length; i++) {
			asciiCode = password.charCodeAt(i);
			if((previousAsciiCode + 1) === asciiCode) {
				numSeqcount++;
				if(numSeqcount >= 2) {
					isConSeq = true;
					break;
				}
			} else {
				numSeqcount = 0;
			}
			previousAsciiCode = asciiCode;
		}

		return isConSeq;
	}

  function passwordIncludesName(password){
    var name= $scope.client_name2;
    var res = name.split(" ");
    var upper = password.toUpperCase();
    for(var i=0 ; i<res.length ; i++){
      if(res[i].length > 2){
        var separateName = res[i].toUpperCase();
        if(upper.includes(separateName)){
          return true;
        }
      }
    }
    return false;
  };

	$scope.confirmPassword = function () {
    if(passwordIncludesName($scope.unlockData.password)){
      setError('La contraseña no puede contener tu nombre ni apellidos');
    } else if(!$scope.unlockData.password){
      setError('Las contraseñas no puede estar vacías');
		} else if($scope.unlockData.password !== $scope.unlockData.passwordAgain){
      setError('Las contraseñas ingresadas no coinciden');
    } else if ( $scope.confirmImage() ) {
			userProvider.unlockUserRequest( $scope.unlockData.username, $scope.unlockData.folio,
				$scope.unlockData.password, $scope.loginData.selectedImage).
				then( function() {
					$scope.selection++;
				}, function(error) {
					setError( error.message );
				});
		}
	};

	$scope.confirmImage = function () {
        if($scope.loginData.selectedImage)
          return true;
        else
          setError("Debe elegir una imagen");
	};


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

  var browser = detectIE.detect();
  if(browser.ie && browser.version <= 9){
    $interval(function(){
      Placeholders.enable();
    },100,0);
  }

}]);
