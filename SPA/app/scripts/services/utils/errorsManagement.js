'use strict';

angular.module('spaApp')
  .service('codeStatusErrors', function() {
    this.errorMessage = function(status) {
      var message = 'Error en el servicio, intente más tarde';
      if (status === 0 || status === 12029) {
        message = 'Error, verifica tu conexión a internet';
        return message;
      }
      else if (status === 403 ) {
        message = 'OTP inválido';
        return message;
      }
      else if (status === 401 || status === 423) {
        message = 'La sesión ha expirado';
        return message;
      }
      else if (status === 406 || status === 417) {
        message = 'Datos inválidos';
        return message;
      }
      else if (status === 500) {
        message = 'Error interno del servidor: ';
        return message;
      }
      else if (status === 503 || status === 504) {

        message = 'Se detectó un error en el proceso, favor de ponerse en contacto con el área de Atención a Clientes';
        return message;
      }
      return message;
    };
  });
