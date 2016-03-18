'use strict';

var assert= chai.assert;
var expect=chai.expect;

describe('Credit Card Controller', function() {
  var creditCardCtrl, scope, rootScope;

  beforeEach(module('spaApp'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    
    creditCardCtrl = $controller('creditCardCtrl', {
      $scope: scope
    });
  }));

  describe('When Getting Message',function(){
    it('should be display message',function(){
      scope.displayMessage();
      expect(scope.searchMessage).to.equal('true');
    });
    it('should be clear message',function(){
      scope.clearMessage();
      expect(scope.searchMessage).to.equal('false');
    });
  });

   describe('When Getting Transactions',function(){
    it('should get previous period',function(){
      scope.getTransactions('123');
      expect(scope.previousPeriod).to.equal('123');
    });
  });

});
