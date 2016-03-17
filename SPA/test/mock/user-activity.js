'use strict';
 
 angular.module('mockedUserActivity', [])
   .value('userActivityJSON', {   
     "userActivity": [
         {
             "date": "12-04-2015",
             "action": "getThirdAccounts",
             "successful":true
         },
         {
             "date": "15-04-2015",
             "action": "transfer",
             "successful":false
         },
         {
            "date": "20-05-2015",
             "action": "changePassword",
             "successful":true
         }
     ]
   }
 );
