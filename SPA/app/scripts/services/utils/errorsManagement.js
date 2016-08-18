angular.module('spaApp')
  .service('codeStatusErrors', function() {
    this.errorMessage = function(status) {
      var message = 'Error en el servicio, intente más tarde';
      if (status === 0 || status === 12029) {
        message = 'Error, verifica tu conexión a internet';
      } else if (status === 403 ) {
        message = 'OTP inválido';
      } else if (status === 401 || status === 423) {
        message = 'La sesión ha expirado';
      } else if (status === 406 || status === 417 || status === 301) {
        message = 'Datos inválidos';
      } else if (status === 500) {
        message = 'Error interno del servidor: ';
      } else if (status === 503 || status === 504 || status === 505 || status === 506) {
        message = 'Se detectó un error en el proceso, favor de ponerse en contacto con el área de Atención a Clientes';
      }
      return message;
    };
  });
