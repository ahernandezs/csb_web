'use strict';

angular.module('mockedBeneficiary',[])
    .value('beneficiaryJSON', {
                "third_accounts": [
                {
                    "_account_id": "8912345678927890-A-40058",
                    "bank_name": "CONSUBANCO",
                    "phone": "5566778899",
                    "maskedAccountNumber": "*****13450",
                    "name": "JUAN PEREZ PEREZ",
                    "e_mail": "pruebas.cascaron@tmp.com.mx",
                    "shortName": "JUAN PEREZ",
                    "same_bank": true,
                    "account_type": "TDC_T"
                },
                {
                    "_account_id": "8912345678927891-A-40058",
                    "bank_name": "CONSUBANCO",
                    "phone": "5566778899",
                    "maskedAccountNumber": "*****13451",
                    "name": "JUAN PEREZ PEREZ",
                    "e_mail": "pruebas.cascaron@tmp.com.mx",
                    "shortName": "JUAN PEREZ",
                    "same_bank": true,
                    "account_type": "TDC_T"
                },
                {
                    "_account_id": "8912345678927892-C-40058",
                    "bank_name": "BANREGIO",
                    "phone": "5566778899",
                    "maskedAccountNumber": "*****13452",
                    "name": "JUAN PEREZ PEREZ",
                    "e_mail": "pruebas.cascaron@tmp.com.mx",
                    "shortName": "JUAN PEREZ",
                    "same_bank": false,
                    "account_type": "DEB_T"
                },
                {
                    "_account_id": "0050568032C41ED4A9D17427B57CF2B1-C-40002",
                    "bank_name": "BANAMEX",
                    "phone": "5519254358",
                    "maskedAccountNumber": "*****CF2B1",
                    "name": "Beneficairy Dummy",
                    "e_mail": "dummy-mail@anzen.com.mx",
                    "shortName": "Short name",
                    "same_bank": false,
                    "account_type": "DEB_T"
                },
                {
                    "_account_id": "0050568032C41ED4ABB43238349D52B1-C-40002",
                    "bank_name": "BANAMEX",
                    "phone": "5519254358",
                    "maskedAccountNumber": "*****D52B1",
                    "name": "Beneficairy Dummy",
                    "e_mail": "dummy-mail@anzen.com.mx",
                    "shortName": "Short name",
                    "same_bank": false,
                    "account_type": "DEB_T"
                },
                {
                    "_account_id": "0050568032C41ED4ABC484AC9C8172B1-C-40002",
                    "bank_name": "BANAMEX",
                    "phone": "5519254358",
                    "maskedAccountNumber": "*****172B1",
                    "name": "Beneficairy Dummy",
                    "e_mail": "dummy-mail@anzen.com.mx",
                    "shortName": "Short name",
                    "same_bank": false,
                    "account_type": "DEB_T"
                }
            ]
        }
    );
