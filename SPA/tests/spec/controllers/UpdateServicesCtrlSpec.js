'use strict';

var expect=chai.expect;

describe('Unit: Update Services Controller',function(){

	var scope,updateServicesCtrl;

	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();

		updateServicesCtrl=$controller('updateServicesController',{
			$scope : scope
		});

		
	}));

	it('should update services', function(){
		var action=1;
		var state="12345678";
		scope.updateService(action,state);
		expect(scope.updateDigitalBankServiceState.otp).to.equal('');
	});
});
