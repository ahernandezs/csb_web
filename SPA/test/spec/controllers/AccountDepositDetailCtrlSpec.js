'use strict';

var expect=chai.expect;

describe('Account Deposit Detail Controller', function() {
  var acountDepositCtrl, scope, rootScope, http;

  beforeEach(module('spaApp'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    
    acountDepositCtrl = $controller('AccountDepositDetailCtrl', {
      $scope: scope
    });
    
    scope.selectedAcccountId = "0050568032C41EE4A1E1C2E88AC65379-DEP";
    scope.searchParams = {
                          'date_start': "08/05/2015",
                          'date_end': "28/05/2018"                  
                         };

  }));

  describe('When Clear Message',function(){
    it('should be clear message',function(){
      scope.clearMessage();
      expect(scope.searchMessage).to.equal('false');
    });
  });

  describe('When Search to Get Transactions Between Two Dates', function() {
    it("should get the transactions response: ", function() {
      // enter in the first fail condition: when the dates are posterior to the "today's date".
      
      expect( scope.search ).to.throw(TypeError);
      //expect(scope.setServiceError).to.throw("Búsqueda no realizada: Fecha Inicial y/o Fecha Final NO pueden ser posteriores a la Fecha de Hoy");
    });

    it("should get the transactions response: ", function() {
      scope.searchParams.date_start = "18/04/2015";
      scope.searchParams.date_end = "09/04/2015";
      // enter in the second fail condition: when the "start date" is posterior to the "end date".
      expect( scope.search ).to.throw(TypeError);
    });

    it("should get the transactions response: ", function() {
      scope.searchParams.date_start = "09/04/2015";
      scope.searchParams.date_end = "18/04/2015";
      // enter in the good condition: getting transaction.
      scope.search();
    }); 
  });
});
