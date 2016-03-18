'use strict';

var expect=chai.expect;

describe('Map Controller', function(){

	var scope, mapCtrl;

	beforeEach(module('spaApp'));

	beforeEach(inject(function($controller,$rootScope){
		scope=$rootScope.$new();

		mapCtrl=$controller('MapCtrl',{
			$scope : scope
		});
	}));

	describe('When Search Near Me',function(){
		it('should show the branchs',function(){
			scope.searchNearMe();
			expect(scope.showBranches).to.be.true;
		});
		
	});
	describe('When defined Center Position',function(){
		it('should assign the lalitude',function(){
			expect(scope.map.center.latitude).to.equal(19.432602);
		});
		it('should assign the longitude',function(){
			expect(scope.map.center.longitude).to.equal(-99.13320499999998);
		});
		it('should initialize the marker',function(){
			expect(scope.marker.id).to.equal(0);
		});
		it('should initialize the branchs',function(){
			expect(scope.map.branches).to.not.undefined;
		});
		
	});
	
});