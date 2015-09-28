'use strict';

angular.module('spaApp')
  .service('codeStatusErrors', function() {
    this.errorMessage = function(status) {
      var message = 'Error en el servicio, intente más tarde';
      if (status === 0 || status === 12029) {
        message = 'Error, verifica tu conexión a internet';
        return message;
      }
      else if (status === 401 || status === 423) {
        // session expired : returned to login
        // error taken from:  transfers.js
        message = 'La sesión ha expirado';
        return message;
      }
      else if (status === 406 || status === 417) {
        // message = 'invalid input: TODO: analyse the code inside the json mesage body';
        // error taken from:  transfers.js
        message = 'Datos inválidos';
        return message;
      }
      else if (status === 500) {
        message = 'Error interno del servidor: ';
        return message;
      }
      else if (status === 503 || status === 504) {
        // business or technical exception
        // message = 'unknown problem. Please retry later';
        // error taken from:  transfers.js
        message = 'Se detectó un error en el proceso favor de comunicarse al teléfono 018008003234 o al 55 9177 7999';
        return message;
      }
      return message;
    };
  });
