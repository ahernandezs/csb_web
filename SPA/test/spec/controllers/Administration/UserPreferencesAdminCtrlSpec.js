'use strict';

var expect=chai.expect;

describe('User Preferences Administration Controller',function(){

	var scope,userPrefAdminCtrl;
	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();

		userPrefAdminCtrl=$controller('UserPreferencesAdministrationController',{
			$scope : scope
		});
	}));

	describe('When Getting Preferences User',function(){

		it('should go to user preferences page',function(){
			scope.userAdministrationStep=2;
			scope.gotoUserPreferencesPage();
			expect(scope.stage_updatecommunication).to.equal('stage1');
		});

		it('should go to user preferences administration page activated',function(){
			var activate=scope.isUserPreferencesAdministrationPageActivated();
			expect(activate).to.be.true;
		});
	});

	describe('When Getting Security Token',function(){

		it('should go to to the security-token configuration page',function(){
			scope.gotoTokenAdministrationPage();
			expect(scope.userAdministrationStep).to.equal(2);
		});

		it('should check if the user is on the security-token configuration page',function(){
			scope.isUserTokenAdministrationPageActivated();
			expect(scope.userAdministrationStep).to.equal(1);
		});
	});

});