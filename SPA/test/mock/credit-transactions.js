'use strict';

angular.module('mockedCreditTransactions',[])
    .value('creditTransJSON', 
    {
		"transactions":
		[
			{
				"amount":45526.23,
				"movementDate":1418450400000,
				"date_application":1412744400000,
				"_transaction_id":123,
				"tax":8.09,
				"interest":12.45,
				"description":"Description Dummy",
				"bucket":
				{
					"id":"912",
					"interest":916.52,
					"name":"Bucket Dummy",
					"capital":456.12
				},
				"capital":495.12
			},
			{
				"amount":9163.23,
				"movementDate":1420178400000,
				"date_application":1420524000000,
				"_transaction_id":654,
				"tax":5.09,
				"interest":11.45,
				"description":"Description Dummy",
				"bucket":
				{
					"id":"312",
					"interest":111.52,
					"name":"Bucket Dummy II",
					"capital":456.12
				},
				"capital":976.12
			}
		]
    }
);

