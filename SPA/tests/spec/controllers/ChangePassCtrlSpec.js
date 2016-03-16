'use strict';

var expect=chai.expect;

describe('Unit: Change Password Controller',function(){

	var scope,changePassCtrl;
	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();

		changePassCtrl=$controller('changePasswordController',{
			$scope : scope
		});

		scope.change.old=undefined;
	}));

	it('Verify the old password should be equal to undefined',function(){
		scope.verifyNewPass();
		expect(scope.error).to.be.true;
	});

	it('Verify the new password should be different to undefined',function(){
		scope.change.new="Buenas154"
		scope.verifyNewPass();
		expect(scope.stage_password).to.equal(1);

	});
	
	it('validate password', function(){
		scope.validatePassword();
		expect(scope.error).to.be.false; 
	});

	it('reset defautl data', function(){
		scope.reset();
		expect(scope.errorMessage).to.equal('');
	});
});