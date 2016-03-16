'use strict';

var expect=chai.expect;

describe('Register Controller', function() {
  
  var registerCtrl, scope,location;


  beforeEach(module('spaApp'));

  beforeEach(inject(function($controller, $rootScope) {
    
    scope = $rootScope.$new();
    
    registerCtrl = $controller('RegisterCtrl', {
      $scope: scope
      
    });
   
  }));

	describe('When go to login',function(){
		
		beforeEach(inject(function($location){
			location=$location;
		}));
		it('should go to login location',function(){
			scope.gotoLogin();
			expect(location.path()).to.equal('/login');
		});
	});

	describe('When the Password is Valid',function(){
		
		it('should validate the password',function(){
			scope.registerData.password	="Prueba147";
			scope.validatePassword();
			expect(scope.invalidPassword).to.be.true;	
		});
		
	});

	describe('When select the image',function(){
		it('should assign the image id', function(){
			var imageID="12345678"
			scope.selectImage(imageID);
			expect(scope.registerData.selectedImage).to.equal('12345678');
		});
	});

	describe('When confirm token',function(){
		it('should be register user',function(){
			scope.confirmToken();
			expect(scope.isRegistering).to.be.true;
		});
	});
});