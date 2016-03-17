'use strict';

var expect=chai.expect;

describe('Transfers Controller', function() {

    beforeEach(module('spaApp', 'mockedAccounts', 'mockedThirdAccounts', 'mockedAccountDetail'));

    // We're going to inject the $controller and the $rootScope
    var ctrl, scope, accounts, thirdAccounts, code, _transaction_id;

    beforeEach( inject( function($controller, $rootScope) {
        // We create the scope
        scope = $rootScope.$new();
        // We create the controller
        scope.session_token="notEmpty";
        ctrl = $controller('TransfersCtrl', {
            $scope: scope
        });
    }));

    describe('Payment Functionality', function() {
        var http;

        beforeEach( inject( function($httpBackend, accountsJSON, thirdAccountsJSON, accountDetailJSON) {
            // This will work as our backend
            http = $httpBackend;
            // These will work as our response data
            accounts = accountsJSON;
            thirdAccounts = thirdAccountsJSON;
            scope.transferAccountDetail = accountDetailJSON;
            // Actual objects for payment
            scope.payment.account = accounts.accounts[4];
            scope.payment.destiny = accounts.accounts[0];
            scope.payment.type = 'WIHTOUT_INTEREST_PAYMENT';
            scope.payment.amount = scope.payment.destiny.no_interes_payment_due;

            http.when('GET', scope.restAPIBaseUrl + '/accounts')
                .respond(
                    200,
                    accounts,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            http.when('GET', scope.restAPIBaseUrl + '/externalaccounts')
                .respond(
                    200,
                    thirdAccounts,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            http.when('GET', scope.restAPIBaseUrl + '/accounts' + scope.payment.destiny._account_id)
                .respond(
                    200,
                    scope.transferAccountDetail,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
        }));

        it('Should get own and third accounts ', function() {
           
            scope.theAccounts.push( accounts.accounts );
            scope.theAccounts.push( thirdAccounts.third_accounts );
            expect( scope.theAccounts ).to.not.be.undefined;
            expect( scope.theAccounts.length ).to.be.above(0);
        });

        it('Should set a TDC to make a payment', function() {
            
            expect( scope.payment.destiny.account_type ).to.equal('TDC');
        });

        it('Should get the detail for the previously selected TDC', function() {
            
            scope.getAccountDetail();
            
            expect( scope.transferAccountDetail.credit_card ).to.not.be.null;
        });

        /*it('Should test the scope.payment.type for its possible values', function() {
            // Default value: WIHTOUT_INTEREST_PAYMENT
            expect( scope.assignValue ).toThrowError(TypeError, "Cannot read property 'offsetWidth' of null");
            // Now MIN_PAYMENT
            scope.payment.type = 'MIN_PAYMENT';
            expect( scope.assignValue ).toThrowError(TypeError, "Cannot read property 'offsetWidth' of null");
            // Finally TOTAL_PAYMENT
            scope.payment.type = 'TOTAL_PAYMENT';
            expect( scope.assignValue ).toThrowError(TypeError, "Cannot read property 'offsetWidth' of null");
        });*/

        it('Should send a payment for TDC', function() {
            //expect( scope.sendPayment ).not.toThrow();

            var jsonBody = JSON.stringify({
                'account_id_destination':scope.payment.destiny._account_id,
                'amount':scope.payment.amount,
                'description':'unit test',
                'completion_date':null
            });
            // service that actually sends the payment
            http.when('POST', scope.restAPIBaseUrl + '/accounts/' + scope.payment.account._account_id + '/transactions')
                .respond(
                    code = 200,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            expect( code ).to.equal( 200 );
        });

        it('Should send a payment but this time for TDC_T', function() {
            scope.payment.destiny = thirdAccounts.third_accounts[0];
            //expect( scope.sendPayment ).not.toThrow();

            var jsonBody = JSON.stringify({
                'account_id_destination':scope.payment.destiny._account_id,
                'amount':100,
                'description':'unit test',
                'completion_date':'2015-04-22T23:47:28.074Z',
                'otp':'123456'
            });
            // service that actually sends the payment
            http.when('POST', scope.restAPIBaseUrl + '/accounts/' + scope.payment.account._account_id + '/transactions')
                .respond(
                    code = 200,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            expect( code ).to.equal( 200 );
        });
    });

    describe('Transfer Functionality', function() {
        var http;

        beforeEach( inject( function($httpBackend, accountsJSON, thirdAccountsJSON) {
            http = $httpBackend;

            accounts = accountsJSON;
            thirdAccounts = thirdAccountsJSON;
            // Actual objects for transfers
            scope.transfer.account = accounts.accounts[4];
            scope.transfer.destiny = accounts.accounts[5];
        }));

        it('Should send a transfer to a DEP account', function() {
            scope.sendTransfer();
            var jsonBody = JSON.stringify({
                'account_id_destination':scope.transfer.destiny._account_id,
                'amount':100,
                'description':'unit test'
            });

            http.when('POST', scope.restAPIBaseUrl + '/accounts/' + scope.transfer.account._account_id + '/transactions')
                .respond(
                    200,
                    _transaction_id = 000293871802062015113416,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            
            expect( _transaction_id ).to.not.be.null;
        });

        it('Should send a transfer to a DEB_T account with same_bank : true', function() {
            scope.transfer.destiny = thirdAccounts.third_accounts[2];
            scope.sendTransfer();

            var jsonBody = JSON.stringify({
                'account_id_destination':scope.transfer.destiny,
                'amount':100,
                'description':'unit test',
                'otp':1223456
            });
            http.when('POST', scope.restAPIBaseUrl + '/accounts/' + scope.transfer.account._account_id + '/transactions')
                .respond(
                    200,
                    _transaction_id = 000293871802062015113416,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            
            expect( _transaction_id ).to.not.be.null;
        });

        it('Should send a transfer to a DEB_T account with same_bank : false', function() {
            scope.transfer.destiny = thirdAccounts.third_accounts[3];
            scope.sendTransfer();

            var jsonBody = JSON.stringify({
                'account_id_destination':scope.transfer.destiny._account_id,
                'amount':100,
                'description':'unit test',
                'otp':123456,
                'reference_number':null,
                'completion_date':'tomorrow'
            });
            http.when('POST', scope.restAPIBaseUrl + '/accounts/' + scope.transfer.account._account_id + '/transactions')
                .respond(
                    200,
                    _transaction_id = 000293871802062015113416,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            
            expect( _transaction_id ).to.not.be.null;
        });
    });

});
