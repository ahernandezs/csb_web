angular.module('spaApp').controller('RegisterCtrl', ['$scope','$location', 'userProvider', '$rootScope', 'timerService' , function ($scope, $location, userProvider, $rootScope, timerService) {

  // the register-flow's current-step
  $scope.selection = 0;

  // stores the register's data inputed by the user
  $scope.registerData = {};

  // is there an error in the register flow
  $scope.error = false;

  // the error's message (is incorrectData is true)
  $scope.errorMessage = null;

  $scope.invalidPassword = true;

  /**
   * initialize the scope with the model's data (coming from the preRegister operation)
   */
  $scope.init = function() {
      var preRegisterData = userProvider.getPreRegistrationData();
      if(!preRegisterData) {
        $scope.gotoLogin();
        return;
      }
      $scope.contract = preRegisterData.contract;
      $scope.nameClient = $scope.contract.name;
      $scope.clientNumber = $scope.contract.client_id;
      $scope.bankBranch = $scope.contract.branch_name;
      $scope.date = $scope.contract.created_at;
      $scope.roleID = $scope.contract.role_id;
      $scope.rfc = $scope.contract.rfc;
      $scope.identifiers = preRegisterData.identifiers;

      // This is at this moment the default option of identifiers
      $scope.registerData.identifier = $scope.identifiers[0];

      $scope.images = {};
      for (var i = 0; i < preRegisterData.images.length; i++) {
          $scope.images[i] = { 'id' : preRegisterData.images[i].image_id, 'url' : $rootScope.restAPIBaseUrl + '/' + preRegisterData.images[i].url };
      }
      //session-timeout: 9 minutes before the warning message
      timerService.idleDuration(540);
      //session-timeout: 1 minute between the warning message and the redirection to the login page
      timerService.warningDuration(60);
      timerService.start();

      $scope.clientName = $scope.nameClient;
  };

  /**
   * go to the next flow's step
   */
  $scope.completeStep = function(nextStep){
    $scope.error = false;
    $scope.errorMessage = null;
    $scope.selection = nextStep;
    var progressHeight = document.getElementById("progressBar").offsetHeight;
    var stepHeight = (((progressHeight / 5)*(nextStep-1)) - progressHeight);
    $scope.currentProgress = {top: stepHeight};
  };

  /**
   * go back to the login page
   */
  $scope.gotoLogin =function(){
    $scope.selection = 0;
    $scope.registerData = {};
    $scope.error = false;
    $scope.errorMessage = null;
    userProvider.resetRegistrationToken();
    $location.path( '/login' );
  };

  $scope.validatePassword = function() {
    $scope.error = false;
    $scope.invalidPassword = true;
    var fullName= $scope.clientName;
    var password = $scope.registerData.password;
    var rePassword = $scope.registerData.repeatPass;
    if(password) {
      var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/g;
      if(!pattern.test(password)) {
        setError('La contraseña debe tener de 8 a 15 caracteres, contar con al menos una mayúscula, una minúscula, y un numérico. NO incluir caracteres especiales');
        return;
      }

      var rexUser1 = new RegExp($scope.clientNumber, "g");
      if(rexUser1.test(password)) {
        setError('No puede usar su id de usuario como contraseña');
        return;
      }

      var rexInstName1 = new RegExp("consubanco", "i");
      if(rexInstName1.test(password)) {
        setError('No puede usar el nombre de la institución como contraseña');
        return;
      }

      var rexRfc = new RegExp($scope.rfc, "i");
      if(rexRfc.test(password)) {
        setError('No puede usar su RFC como contraseña');
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

      if (password !== rePassword){
				setError('Las contraseñas no coinciden');
				return;
			}

      $scope.invalidPassword = false;

    }
  }

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
    var name= $scope.clientName;
    var res = name.split(" ");
    var upper = password.toUpperCase();
    for(var i=0 ; i<res.length ; i++){
      if(res[i].length > 2){
        var separateName=res[i].toUpperCase();
        if (upper.includes(separateName)) {
          return true;
        }
      }
    }
    return false;
  };

  /**
  * validate the client's password
  */
  $scope.confirmPassword = function () {
    if(passwordIncludesName($scope.registerData.password)){
      setError('La contraseña no puede contener tu nombre ni apellidos');
    }else if(!$scope.registerData.password){
      setError('Las contraseñas no puede estar vacías');
    }else if($scope.registerData.password !== $scope.registerData.repeatPass){
      setError('Las contraseñas ingresadas no coinciden');
    }else{
      userProvider.setPassword($scope.registerData.password);
      userProvider.setIdentifier($scope.registerData.identifier);
      $scope.completeStep(3);
    }
  };

  /**
   * assign image
   */
  $scope.selectImage = function(imageId) {
    $scope.registerData.selectedImage = imageId;
  };

  /**
   * validate the client's image
   */
  $scope.confirmImage = function () {
        if($scope.registerData.selectedImage){
            // set the model and go to the next step
        	userProvider.setImageId($scope.registerData.selectedImage);
        	$scope.completeStep(4);
        }else{
            setError("Debe elegir una imagen");
        }
  };

  /**
   * validate the client's contact-information (phone number and email)
   */
  $scope.confirmContactInformation = function () {
        var error =false;
        if($scope.registerData.email){
          if($scope.registerData.email !== $scope.registerData.repeatEmail){
            error = true;
            setError('Los correos electrónicos no coinciden');
          }
        }else{
          if($scope.registerData.contactType === 'byEmail'){
            error = true;
            setError('Debes ingresar una dirección de correo electrónico');
          }
        }
        if($scope.registerData.cellphone){
          if($scope.registerData.cellphone !== $scope.registerData.repeatCellphone){
            error = true;
            setError('Los numeros de celular ingresados no coinciden');
          }
        }else{
          if($scope.registerData.contactType === 'byCellPhone'){
            error = true;
            setError('Debe ingresar un número de celular');
          }
        }

        //we could use the $scope.incorrectData instead of a local variable "error", but it show more clarity this way
        if(! error){
            userProvider.setEmail($scope.registerData.email);
            userProvider.setPhoneNumber($scope.registerData.cellphone);
            if($scope.roleID === 1) {
              $scope.completeStep(5);
            } else {
              registerUser();
            }
        }
  };

  /**
   * confirm token
   */
  $scope.confirmToken = function () {
    userProvider.setCardId($scope.registerData.token);
    userProvider.setOtp1($scope.registerData.otp1);
    userProvider.setOtp2($scope.registerData.otp2);
    registerUser();
  };

  /**
   * Register user
   */
  function registerUser() {
    $scope.isRegistering = true;
    userProvider.registerUser().then(
        function(data) {
          $scope.isRegistering = false;
          //check if the security token has been activated
          $scope.tokenRegistrationFailed = false;
          if($scope.roleID === 1){
            if(data.token_registration_result !== null && data.token_registration_result.result === false){
              $scope.tokenRegistrationFailed = true;
            }else{
              $scope.tokenRegistrationFailed = false;
            }
          }
          $scope.completeStep(6);
        },
        function(data) {
          $scope.isRegistering = false;
          if(data.status !== 401){
            $scope.setServiceError('Ha ocurrido un error en el registro');
          }
        }
      );
  }

  /**
   * private method: set an error on the register flow
   */
  function setError(errorMessage){
      $scope.error = true;
      $scope.errorMessage = errorMessage;
  };

  if(!userProvider.getRegistrationToken()) {
    $scope.gotoLogin();
    return;
  }

  $scope.$on('WarningTimeout', function() {
    $scope.gotoLogin();
   });

  $scope.$on('IdleTimeout', function() {
    $scope.showIdleAlert = true;
   });

}]);
