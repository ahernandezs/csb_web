angular.module('spaApp')
.service('transferService', ['$http', '$rootScope',function ($http, $rootScope) {
     /**
      * transfer to an account owned by the user
      */
     this.transferToOwnAccount = function(sourceAccount, destinationAccount, amount, description){
        var jsonBody = JSON.stringify({
            'account_id_destination':destinationAccount,
            'amount':amount,
            'description':description
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
    * transfer to a third-account from Consubanco
    */
    this.transferThirdAccountSameBank = function(sourceAccount, destinationAccount, amount, description, otp){
        var jsonBody = JSON.stringify({
            'account_id_destination':destinationAccount,
            'amount':amount,
            'description':description,
            'otp':otp
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
    * transfer to a third-account another than Consubanco
    */
    this.transferThirdAccountOtherBank = function(sourceAccount, destinationAccount, amount, description, otp, referenceNumber, completionDate){
        var jsonBody = JSON.stringify({
            'account_id_destination':destinationAccount,
            'amount':amount,
            'description':description,
            'otp':otp,
            'reference_number':referenceNumber,
            'completion_date':completionDate
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
      * pay a credit-card own by the user
      */
     this.payOwnCard = function(sourceAccount, cardAccount, amount, description, date){
        var jsonBody = JSON.stringify({
            'account_id_destination':cardAccount,
            'amount':amount,
            'description':description,
            'completion_date':date
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
      * pay a third credit-card
      */
     this.payThirdCard = function(sourceAccount, cardAccount, amount, description, date, otp){
        var jsonBody = JSON.stringify({
            'account_id_destination':cardAccount,
            'amount':amount,
            'description':description,
            'completion_date':date,
            'otp':otp
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
      * invest money in a user own VISTA investment-account
      */
     this.investVista = function(sourceAccount, destinationVistaAccount, amount){
        var jsonBody = JSON.stringify({
            'account_id_destination':destinationVistaAccount,
            'amount':amount
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
      * retire money from a own VISTA investment-account
      */
     this.retireVista = function(sourceVistaAccount, destinationAccount, amount){
        var jsonBody = JSON.stringify({
            'account_id_destination':destinationAccount,
            'amount':amount
        });
        return sendHttp(sourceVistaAccount, jsonBody);
    };

    /**
      * invest money in a CEDE product
      */
     this.investCEDE = function(sourceAccount, productId, amount, investAgain){
        var investmentInstruction = 1;
        if(investAgain){
         investmentInstruction = 2;
        }
        var jsonBody = JSON.stringify({
            'account_id_destination':productId,
            'amount':amount,
            'investment_instruction':investmentInstruction
        });
        return sendHttp(sourceAccount, jsonBody);
    };

    /**
      * invest money in a PRLV product
      */
     this.investPRLV = function(sourceAccount, productId, amount, investAgain){
        var investmentInstruction = 1;
        if(investAgain){
         investmentInstruction = 3;
        }
        var jsonBody = JSON.stringify({
            'account_id_destination':productId,
            'amount':amount,
            'investment_instruction':investmentInstruction
        });
        return sendHttp(sourceAccount, jsonBody);
    };

     /**
      * internal function to send a http-request to the transfer REST-API service
      */
    function sendHttp(sourceAccount, jsonBody){
     return $http({
            url: $rootScope.restAPIBaseUrl+'/accounts/'+sourceAccount+'/transactions',
            method: 'POST',
            data: jsonBody,
            headers: {'Content-Type': 'application/json','X-AUTH-TOKEN': $http.defaults.headers.common['X-AUTH-TOKEN'] }
        });
    };

}]);
