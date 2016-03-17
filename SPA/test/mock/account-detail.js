'use strict';

angular.module('mockedAccountDetail',[])
    .value('accountDetailJSON', {
        'credit_card' : {
            'cycle_date':1391580000000,
            'payment_due_date':1399611600000,
            'credit_limit':55000,
            'statement_balance':834.55,
            'no_interes_payment_due':345.77,
            'current_balance':123.55,
            'cycle_day':11,
            'minimum_payment':456.0,
            'delinquent_balance':28345.99,
            'available_credit':45000.0
        }
    }
);
