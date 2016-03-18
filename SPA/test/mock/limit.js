'use strict';
 
 angular.module('mockedLimits', [])
   .value('limitsJSON', {   
     "limits": [
         {
             "amount": "7000",
             "type": "PAYCARD_CONSUBANCO",
             "type_name" : ""
         },
         {
             "amount": "8000.0",
             "type": "TRANSFER_SPEI",
             "type_name" : ""
         },
         {
             "amount": "9500",
             "type": "TRANSFER_CONSUBANCO",
             "type_name" : ""
         }
     ]
   }
 );
