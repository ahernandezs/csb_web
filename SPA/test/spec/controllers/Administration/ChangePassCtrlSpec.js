'use strict';

var expect=chai.expect;

describe('Change Password Controller',function(){

	var scope,changePassCtrl, userPrefCtrl;
	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();

		changePassCtrl=$controller('changePasswordController',{
			$scope : scope
		});
		userPrefCtrl=$controller('UserPreferencesAdministrationController',{
			$scope: scope
		});
	}));

	it('when initialize the controller',function(){
		expect(scope.showError).to.be.false;
		expect(scope.changeCrtl.changeError).to.be.false;
	});

	it('when reset the default data',function(){
		scope.reset;
		expect(scope.changeCrtl.changeStep).to.be.equal(1);
	});

	it('verify the modification of new password',function(){
		scope.modifyPassword();
		expect(scope.changeCrtl.changeStep).to.be.equal(3);
	});

	/*it('validate the new password',function(){
		scope.change.new="Buenas154";
		var fullName="Mohamed Labara";
		scope.validatePassword();
		expect(scope.invalidPassword).to.be.false;
	});*/
	it('when validate an incorrect new password',function(){
		scope.change.new="Buen15";
		scope.validatePassword();
		expect(scope.changeCrtl.changeError).to.be.true;
	});
});
