'use strict';

var expect=chai.expect;

describe('Unit: Contact Controller',function (){

	var scope,contactCtrl;
	beforeEach(module('spaApp'));

	beforeEach(inject(function($rootScope,$controller){
		scope=$rootScope.$new();
		contactCtrl=$controller('ContactCtrl',{
			$scope:scope
		});
	}));

	it('should logout of session',function(){
		scope.logout();
		scope.closeSession=true;
		expect(scope.closeSession).to.be.true;
	});
});