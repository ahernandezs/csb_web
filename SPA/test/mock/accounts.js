'use strict';

angular.module('mockedAccounts', [])
  .value('accountsJSON', {
    "accounts" :
    [
      {
        "_account_id":"0050568032C41EE4A1E0FE362B80D379-TDC",
        "cycle_date":1421042400000,
        "maskedAccountNumber":"*****0D379",
        "payment_due_date":1422856800000,
        "account_number":"0050568032C41EE4A1E0FE362B80D379",
        "name":"TARJETA DE CREDITO NARANJA",
        "current_balance":0,
        "lastment_statement_balance":0,
        "deposits":0,
        "currency":"MXN",
        "account_type":"TDC"
      },
      {
        "balance":80000,
        "_account_id":"0050568032C41EE4A1E1429FBF28F379-INV",
        "category":"PRLV",
        "maskedAccountNumber":"*****8F379",
        "account_number":"0050568032C41EE4A1E1429FBF28F379",
        "name":"PRLV 60 DÍAS",
        "currency":"PESOS",
        "account_type":"INV"
      },
      {
        "balance":80000,
        "_account_id":"0050568032C41EE4A5D9433AE82A7379-INV",
        "category":"CEDE",
        "maskedAccountNumber":"*****A7379",
        "account_number":"0050568032C41EE4A5D9433AE82A7379",
        "name":"CEDE 60 DÍAS",
        "currency":"PESOS",
        "account_type":"INV"
      },
      {
        "balance":80000,
        "_account_id":"0050568032C41EE4A5D944DD0A211379-INV",
        "category":"VISTA",
        "maskedAccountNumber":"*****11379",
        "account_number":"0050568032C41EE4A5D944DD0A211379",
        "name":"INVERSION VISTA PF",
        "currency":"PESOS",
        "account_type":"INV"
      },
      {
        "amount":240000,
        "_account_id":"0050568032C41EE4A1E1C2E88AC65379-DEP",
        "maskedAccountNumber":"*****65379",
        "account_number":"0050568032C41EE4A1E1C2E88AC65379",
        "withdrawals":652130,
        "name":"CONSUCUENTA COMERCIAL PM",
        "current_balance":412130,
        "currency":"PESOS",
        "account_type":"DEP"
      },
      {
        "amount":230000,
        "_account_id":"0050568032C41EE4A1E1C2E88AC75379-DEP",
        "maskedAccountNumber":"*****75379",
        "account_number":"0050568032C41EE4A1E1C2E88AC75379",
        "withdrawals":642130,
        "name":"CONSUCUENTA COMERCIAL PM 2",
        "current_balance":402130,
        "currency":"PESOS",
        "account_type":"DEP"
      },
      {
        "request_amount":68000,
        "account_number":"0050568032C41EE4A1E123CC55261379",
        "current_balance":45814.2,
        "payment_last_date":1408078800000,
        "capital":44567.91,
        "discountAmount":1900.75,
        "currency":"PESOS",
        "amount":1747.56,
        "dependency":"SECRETARIA DE EDUCACION Y CULT",
        "formalization_date":1357192800000,
        "balance":112.91,
        "_account_id":"0050568032C41EE4A1E123CC55261379-CXN",
        "maskedAccountNumber":"*****61379",
        "interest":1133.38,
        "name":"SINDICATO NACIONAL DE TRABAJAD",
        "account_type":"CXN"
      }
    ]
  }
);