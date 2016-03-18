'use strict';
 
var expect=chai.expect;


describe('Administration Controller', function() {
   
  var adminCtrl, dashboardCtrl, scope, http, limit, location, thirdAccount, useractivity,beneficiaries;
 
  beforeEach(module('spaApp','mockedLimits','mockedThirdAccounts','mockedUserActivity', 'mockedBeneficiary'));

  beforeEach(inject(function($controller,$rootScope){
    scope=$rootScope.$new();
    adminCtrl=$controller('AdminCtrl',{
      $scope: scope
    });
  }));

  describe("When Getting Activities",function(){
    beforeEach(inject(function($httpBackend,userActivityJSON){
      http=$httpBackend;
      useractivity=userActivityJSON.userActivity;

      http.when('GET', scope.restAPIBaseUrl   + '/useractivity')
          .respond(
            200,
            useractivity,
            {
              "X-AUTH-TOKEN" : scope.session_token
              }
         );
    }));

    it('should map an activities',function(){
      var actividad=scope.mapUserActivity(useractivity[0].action);
      expect(actividad).to.equal("Consulta de Cuentas de Terceros");
    });

    it('should assign a status to the activity', function(){
      var status=scope.mapActivityStatus(useractivity[0].successful);
      expect(status).to.equal('exitoso');
    });
  });

  describe("When Getting Beneficiaries",function(){
    
    beforeEach(inject(function(beneficiaryJSON){
      beneficiaries = beneficiaryJSON.third_accounts;
    }));

    it('should get the beneficiaries',function(){
      scope.selectBeneficiary(beneficiaries[0]);
      expect(scope.action).to.equal(2);
    });

    it('should add a beneficiary',function(){
      scope.addBeneficary();
      expect(scope.action).to.equal(3);
    });
  });
 	
  describe('When Getting a Third Account',function(){

    beforeEach(inject(function($httpBackend,thirdAccountsJSON){
      http=$httpBackend;
      thirdAccount=thirdAccountsJSON.third_accounts;

      http.when('GET', scope.restAPIBaseUrl  +  '/externalaccounts')
          .respond(
            200,
            thirdAccount,
            {
              "X-AUTH-TOKEN" : scope.session_token
              }
          );

    }));
    it('should validate a third account',function(){
      scope.validateThirdAccount();
      expect(thirdAccount[0]._account_id).to.equal('8912345678927890-A-40058');
    });
  });

 	describe("When Set and Get a Limit",function(){
 		
    beforeEach(inject(function($httpBackend, limitsJSON) {	
 		  scope.session_token="notEmpty";
      http=$httpBackend;
      limit = limitsJSON.limits; 
 		  
      
      http.when('GET', scope.restAPIBaseUrl   + '/accounts/limits')
          .respond(
            200,
            limit,
            {
              "X-AUTH-TOKEN" : scope.session_token
            }
          );
      http.when('GET', scope.restAPIBaseUrl   + '/accounts/limits')
          .respond(          
            503,  {"code":300, "message" : "technical error"},
            limit,
            {
             "X-AUTH-TOKEN" : scope.session_token
            }       
          );

      for(var i=0 ;i < limit.length ; i++){
          var type_name=limit[i].type;
          if(type_name == "PAYCARD_CONSUBANCO"){
            limit[i].type_name="Pago a TDC Terceros Consubanco";
          }else if (type_name == "TRANSFER_CONSUBANCO") {
            limit[i].type_name="Transferencia Terceros Consubanco";
          }else if (type_name == "TRANSFER_SPEI"){
            limit[i].type_name="Transferencia Terceros Otro Banco";
          }
      }	 	  
 	  }));
    
     it("setLimits",function(){
      //http.flush();
      scope.setLimits(1200, 'C', 123569);
      var amount=limit[1].amount;
      expect(amount).to.equal('8000.0');
    });

    it('should get a limit',function(){
      expect(limit[0].type_name).to.equal('Pago a TDC Terceros Consubanco');
    });
  });
});