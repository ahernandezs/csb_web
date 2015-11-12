'use strict';

/**
 * api initializer factory
 */

angular.module('spaApp').factory('accountsProvider', ['$rootScope', 'accountsService', '$q', function ($rootScope, accountsService, $q) {

  return {
    getAccounts: function () {
      var deferred = $q.defer();
      //console.log('getting accounts');
      accountsService.getAccounts().success(function(data, status, headers) {
        $rootScope.accounts = data.accounts;
        deferred.resolve();
      }).error(function(data, status) {
        var result = {'response' : data, 'status': status};
        //console.log(data, status);
        return deferred.reject(result);
      });

      return deferred.promise;
    },

    getAccountDetail: function(accountId) {
      var deferred = $q.defer();
      //console.log('getting account details');

      accountsService.getAccountsDetail(accountId).success(function(data, status, headers) {
        $rootScope.accountDetail = data;
        deferred.resolve();
      }).error(function(data, status) {
        var result = {'response' : data, 'status': status};
        //console.log(data, status);
        return deferred.reject(result);
      });

      return deferred.promise;
    },

    getTransactions: function(accountId, params){

      var deferred = $q.defer();
      //console.log('getting transactions');

      accountsService.getTransactions(accountId, params).success(function(data, status, headers) {
        $rootScope.transactions = data.transactions;
        deferred.resolve();
      }).error(function(data, status) {
        var result = {'response' : data, 'status': status};
        //console.log(data, status);
        return deferred.reject(result);
      });

      return deferred.promise;

    },

    transferOwnAccounts: function(sourceAccount, destinationAccount, amount, description, completionDate){
      var deferred = $q.defer();
      accountsService.postTransfer(sourceAccount, destinationAccount, amount, description, completionDate).success(function(data, status, headers){
        deferred.resolve();
      }).error(function(data, status){
        var result = {'response' : data, 'status': status};
        //console.log(data, status);
        return deferred.reject(result);
      });
      return deferred.promise;

    },


    getAccountTransactions: function (accountId, numPage, size) {
      var index = this.getAccountIndex(accountId);
      var currentAccount = $rootScope.accounts[index];
      var deferred = $q.defer();
      //we already have all the transactions
      if(currentAccount.allTransactionsLoaded == true){
        deferred.resolve();
      }else{
        //if accounts has undefinied transactions get transactions from API
          //console.log('getting transactions for account ' + accountId + ' from page ' + numPage);
          accountsService.getAccount(accountId,numPage, size).success(function(data, status, headers) {
            
            if(data.transactions){
              var items = data.transactions;
              for (var i = 0; i < items.length; i++) {
                $rootScope.transactions.push(items[i]);
              }
              //if it is the last page
              if(items.length < size){
                currentAccount.allTransactionsLoaded=true;
              }
            }//no transaction returned, we are not willing to invoke the service no more?
            else{
              currentAccount.allTransactionsLoaded=true;
            }
            deferred.resolve();
          }).error(function(data, status) {
            var response = {'data' : data, 'status': status};
            //console.log(data, status);
            return deferred.reject(response);
          });
      }
      //fill currentAccount with rootScope data

      return deferred.promise;
    },

    /**
     * getting the list of account-statements
     */
    getStates: function(accountId){
      var deferred = $q.defer();
      //console.log('getting list of statements');
      accountsService.getStates(accountId).success(function(data, status, headers) {
        $rootScope.statements = data.statements;
        //console.log(JSON.stringify($rootScope.statements));
        deferred.resolve();
      }).error(function(data, status) {
        var result = {'response' : data, 'status': status};
        //console.log(data, status);
        return deferred.reject(result);
      });
      return deferred.promise;
    },

    clean: function(){
      $rootScope.accounts = null;
      $rootScope.statements = null;
      $rootScope.statement = null;
      $rootScope.accountDetail = null;
      $rootScope.transactions = null;
    },

    setInstruction: function(accountId, instruction){
      var deferred = $q.defer();
      accountsService.setInstruction(accountId, instruction).success(function(data, status, headers) {
        $rootScope.statements = data.statements;
        deferred.resolve();
      }).error(function(data, status) {
        var result = {'response' : data, 'status': status};
        return deferred.reject(result);
      });
      return deferred.promise;
    }

  };
}]);
