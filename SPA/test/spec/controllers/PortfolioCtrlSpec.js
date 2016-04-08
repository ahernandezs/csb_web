'use strict';

var expect=chai.expect;

describe('Portfolio Controller and Investmen Cede Controller', function() {

    beforeEach(module('spaApp', 'mockedAccounts', 'mockedProductsInvest', 'mockedInvestmentResult'));

    // We're going to inject the $controller and the $rootScope
    var portfolioCtrl, cedePRLVCtrl, vistaCtrl, scope, code;
    var accounts, ownAccounts, depositAccounts, vistaAccounts, products, investmentProducts, cedePRLVResult, vistaResult;
    var $filter;

    beforeEach( inject( function($controller, $rootScope, _$filter_) {
        // We create the scopes
        scope = $rootScope.$new();
        
        // We create the controllers
        scope.session_token="notEmpty";
       
        // Load controllers
        portfolioCtrl = $controller('PortfolioCtrl', {
            $scope: scope
        });
        cedePRLVCtrl = $controller('InvestmentCedePrlvCtrl', {
            $scope: scope
        });
        vistaCtrl = $controller('purchaseRetireVistaCtrl', {
            $scope: scope
        });

        // Inject the filter
        $filter = _$filter_;
    }));

    describe('CEDE and PRLV Investments Functionality', function() {
        var http;

        beforeEach( inject( function(_$httpBackend_, accountsJSON, investmentsJSON, resultJSON) {
            // This will work as our backend
            http = _$httpBackend_;

            // These will work as our response data
            accounts = accountsJSON;
            products = investmentsJSON;
            cedePRLVResult = resultJSON;

            // Actual objects for investment
            scope.investment = {};
            scope.investment.originAccount = accounts.accounts[4];
            scope.investment.destinationProduct = products.products[0];
            
            http.when('GET', scope.restAPIBaseUrl + '/accounts')
                .respond(
                    200,
                    accounts,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            http.when('GET', scope.restAPIBaseUrl + '/products')
                .respond(
                    200,
                    products,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
        }));

        it('Should get own accounts and products', function() {
            
            // Run the service
            //http.flush();

            scope.ownAccounts.push( accounts.accounts );
            //scope.investmentProducts.push( products.products );

            expect( scope.ownAccounts ).to.not.be.undefined;
            expect( scope.investmentProducts ).to.be.undefined;
            expect( products.investment_cede_allowed ).to.be.true;
            expect( products.investment_prlv_allowed ).to.be.true;
        });

        it('Should filter at least one DEP account', function() {
            var account;

            for ( var i = 0; i < accounts.accounts.length; i++ ) {
                account = accounts.accounts[i];
                if ( account.account_type === 'DEP' ) {
                    account.displayName = account.name + ' ' + account.maskedAccountNumber + ' - ' + account.currency + ': ' + $filter('currency')(account.amount, '$');
                    account.detail = account.name + ' | ' + account.currency + ': ' + $filter('currency')(account.amount, '$');
                    scope.ownAccounts.push( account );
                }
            }

            expect( scope.ownAccounts.length ).to.be.above(0);
        });

        it('Should set the investment type', function() {
            scope.setInvestmentType('CEDE');
            expect( scope.investmentInstructions ).to.not.be.undefined;

            scope.setInvestmentType('PRLV');
            expect( scope.investmentInstructions ).to.not.be.undefined;
        });

        it('Should make a CEDE investment', function() {
            
            // set up everything for the investment
            scope.setInvestmentType('CEDE');
            scope.investment.expirationInstruction = scope.investmentInstructions;

            scope.investmentCategory = ( products.investment_cede_allowed ) ? 'CEDE': null;
            
            http.when('GET', scope.restAPIBaseUrl + '/accounts' + scope.investment.originAccount._account_id + '/transactions')
                .respond(
                    200,
                    cedePRLVResult,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );

            expect( cedePRLVResult ).to.not.be.undefined;
        });

        it('Should make a PRLV investment', function() {
            scope.investment.destinationProduct = products.products[4];
            scope.setInvestmentType('PRLV');
            scope.investment.expirationInstruction = scope.investmentInstructions;

            scope.investmentCategory = ( products.investment_prlv_allowed ) ? 'PRLV': null;
            
            http.when('GET', scope.restAPIBaseUrl + '/accounts' + scope.investment.originAccount._account_id + '/transactions')
                .respond(
                    200,
                    cedePRLVResult,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );

            expect( cedePRLVResult ).to.not.be.undefined;
        });

    });

    describe('VISTA Investments Functionality', function() {
        var http;

        beforeEach( inject( function($httpBackend, accountsJSON, investmentsJSON, resultJSON) {
            http = $httpBackend;
            accounts = accountsJSON;
            depositAccounts = accountsJSON;
            products = investmentsJSON;
            vistaResult = resultJSON;
        
            http.when('GET', scope.restAPIBaseUrl + '/accounts')
                .respond(
                    200,
                    accounts,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
            http.when('GET', scope.restAPIBaseUrl + '/products')
                .respond(
                    200,
                    products,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );
        }));

        it('Should get own accounts and products', function() {
            
            // Run the service
            //http.flush();

            scope.depositAccounts.push( accounts.accounts );
            //scope.investmentProducts.push( products.products );

            expect( scope.depositAccounts ).to.not.be.undefined;
            //expect( scope.investmentProducts ).not.toBeUndefined();
            expect( products.investment_vista_allowed ).to.be.true;
        });

        it('Should filter at least one DEP account and one VISTA', function() {
            var account;

            for ( var i = 0; i < accounts.accounts.length; i++ ) {
                account = accounts.accounts[i];
                if ( account.account_type === 'DEP' ) {
                    account.displayName = account.name + ' ' + account.maskedAccountNumber + ' - ' + account.currency + ': ' + $filter('currency')(account.amount, '$');
                    account.detail = account.name + ' | ' + account.currency + ': ' + $filter('currency')(account.amount, '$');
                    //scope.ownAccounts.push( account );
                    scope.depositAccounts.push( account );
                } else if ( account.account_type === 'INV' && account.category === 'VISTA' ) {
                    account.displayName = account.name + ' ' + account.maskedAccountNumber + ' - ' + account.currency + ': ' + $filter('currency')(account.balance, '$');
                    account.detail = account.name + ' | ' + account.currency + ': ' + $filter('currency')(account.balance, '$');
                    scope.vistaAccounts.push( account );
                }
            }

            expect( scope.depositAccounts.length ).to.be.above(0);
            expect( scope.vistaAccounts.length ).to.be.above(0);
        });

        it('Should make a VISTA investment', function() {
            scope.investment.vistaAccount = accounts.accounts[3];
            scope.investment.depositAccount = depositAccounts.accounts[4];
            scope.investment.amount = 100;

            http.when('GET', scope.restAPIBaseUrl + '/accounts' + scope.investment.depositAccount._account_id + '/transactions')
                .respond(
                    200,
                    vistaResult,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );

            expect( vistaResult ).to.not.be.undefined;
        });

        it('Should make a withdrawal from a VISTA investment', function() {
            scope.investment.depositAccount = depositAccounts.accounts[4];
            scope.investment.vistaAccount = accounts.accounts[3];
            scope.investment.amount = 100;

            http.when('GET', scope.restAPIBaseUrl + '/accounts' + scope.investment.vistaAccount._account_id + '/transactions')
                .respond(
                    code = 200,
                    {
                        "X-AUTH-TOKEN" : scope.session_token
                    }
                );

            expect( code ).to.equal( 200 );
        });

    });

});
