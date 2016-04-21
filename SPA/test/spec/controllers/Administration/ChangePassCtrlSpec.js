'use strict';

var expect=chai.expect;

describe('Change Password Controller',function(){

	var scope,changePassCtrl;
	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();

		changePassCtrl=$controller('changePasswordController',{
			$scope : scope
		});

		scope.change.old=undefined;

	}));

	it('verify the old password should be equal to undefined',function(){
		scope.verifyNewPass();
		expect(scope.changeCrtl.changeStep).to.be.equal(2);
	});

	it('verify the new password should be different to undefined',function(){
		scope.change.new="Buenas154"
		scope.verifyNewPass();
		expect(scope.changeCrtl.changeStep).to.equal(1);

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
