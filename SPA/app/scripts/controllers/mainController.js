'use strict';

/**
 * The accounts controller. Gets accounts passing auth parameters
 */
 angular.module('spaApp').controller('MainCtrl', ['$scope', function ( $scope) {
	
    $scope.hasServiceError=false;

    /**
     * set an error message
     */
    $scope.setServiceError = function(message) {
        $scope.serviceErrorMessage = message;
        $scope.hasServiceError = true;
    };

    /**
     * remove an error message
     */
    $scope.resetServiceError= function() {
        $scope.serviceErrorMessage = null;
        $scope.hasServiceError = false;
    };

    /**
     * manage a custom message when OTP validation fails
     */
    $scope.manageOtpErrorMessage= function(response) {
        var message = 'OTP inválido';
        if(response.code !== null){
            var tokenStatusCode = response.code;
            switch(tokenStatusCode){
                case 0 :
                    message = 'Su token no ha sido activado, debe activarlo en el panel de administración';
                    break;
                case 1 :
                    message = 'OTP inválido, si estás seguro que tu OTP es válido tal vez necesites sincronizarlo en el panel de administración';
                    break;
                case 2 :
                    message = 'Su token está bloqueado, por favor llame al centro de atención a clientes';
                    break;
                case 3 :
                    message = 'Su token está deshabilitado';
                    break;
                case 99 :
                    message = 'Error técnico, no pudimos obtener el estado de tu token';
                    break;
            }
        }
        $scope.setServiceError(message);
    };

}]);
