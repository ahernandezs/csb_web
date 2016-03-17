'use strict';

var expect=chai.expect;

describe('Accounts Controller', function() {
  
  var accountsCtrl, dashboardCtrl, mainCtrl, scope, http, accounts, location;


  beforeEach(module('spaApp','mockedAccounts'));

  beforeEach(inject(function($controller, $rootScope) {
    
    scope = $rootScope.$new();
    $rootScope.session_token="notEmpty";
    
    //initialize the parent's controllers
    mainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    dashboardCtrl = $controller('DashBoardCtrl', {
      $scope: scope
    });
    //initialize the controller
    accountsCtrl = $controller('AccountsCtrl', {
      $scope: scope
    });
  }));

  /**
   * the the service success
   */
  describe('When Successfully Loading Accounts', function() {
    
    beforeEach(inject(function($httpBackend,accountsJSON){

      http=$httpBackend;
      accounts=accountsJSON.accounts;

      http.when('GET', scope.restAPIBaseUrl + '/accounts')
      .respond(
        200,
        accounts,
        {
          "X-AUTH-TOKEN" : scope.session_token
        }
      );
    
      for(var i=0 ;i < accounts.length ; i++){
          switch(accounts[i].account_type){
              case 'TDC' : scope.showTDCAccount = true; break;
              case 'INV' : scope.showInvestmentAccount = true; break;
              case 'DEP' : scope.showSavingAccount = true; break;
              case 'CXN' : scope.showCreditAccount = true; break;
          }
      }
    
    }));
      
    it("should get the user's accounts", function() {
                   
        //http.flush();
        expect(accounts.length).to.equal(7);
        expect(scope.showTDCAccount).to.be.true;
        expect(scope.showInvestmentAccount).to.be.true;
        expect(scope.showSavingAccount).to.be.true;
        expect(scope.showCreditAccount).to.be.true;
    });
    
  });

  /**
   * the the service failure
   */
  describe('When Fails to Load Accounts', function() {
    
    beforeEach(inject(function($httpBackend){
      var message= "technical error";
      var service={};

      http=$httpBackend;

      //override the mock message
        http.when('GET', scope.restAPIBaseUrl + '/accounts').respond(
          503,
          {"code":null, "message" : message},
          {
            "X-AUTH-TOKEN" : scope.session_token
          }
        );

      scope.setServiceError(message);  

    }));
        
      it("should display a error-message", function() {
             
        //http.flush();
        expect(scope.hasServiceError).to.be.true;
      
      });
    
  });


  /**
   * test the selectAccount method
   */
  describe('When Selecting an Account...', function() {

    var creditCardAccount, investmentAccount, depositAccount, creditAccount;

    beforeEach(inject(function($httpBackend,accountsJSON,$location){

      http=$httpBackend;
      accounts=accountsJSON.accounts;
      location=$location;

      http.when('GET', scope.restAPIBaseUrl + '/accounts')
        .respond(
          200,
          accounts,
          {
            "X-AUTH-TOKEN" : scope.session_token
          }
      );
      
      for(var i=0 ;i < accounts.length ; i++){
          switch(accounts[i].account_type){
              case 'TDC' : creditCardAccount = accounts[i]; break;
              case 'INV' : investmentAccount = accounts[i]; break;
              case 'DEP' : depositAccount = accounts[i]; break;
              case 'CXN' : creditAccount = accounts[i]; break;
          }
      }

    }));
      

    it("type of TDC, should go the the TDC location", function() {
      //http.flush();
      scope.selectAccount(creditCardAccount);
      expect(location.path()).to.equal('/accounts/'+creditCardAccount._account_id+'/tdc');
    });

    it("type of INV, should go the the INV location", function() {
      scope.selectAccount(investmentAccount);
      expect(location.path()).to.equal('/accounts/'+investmentAccount._account_id+'/investment');
    });

    it("type of DEP, should go the the DEP location", function() {
      scope.selectAccount(depositAccount);
      expect(location.path()).to.equal('/accounts/'+depositAccount._account_id+'/deposit');
    });

    it("type of CXN, should go the the CXN location", function() {
      scope.selectAccount(creditAccount);
      expect(location.path()).to.equal('/accounts/'+creditAccount._account_id+'/credit');
    });
  });  


  //to prevent the confirmation message when closing the windows
  afterEach(inject(function($rootScope) {
    $rootScope.session_token=null;
  }));
   
});
