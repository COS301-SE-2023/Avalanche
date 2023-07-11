# Getting Started
This document shows how to succesfully use the Avalanche Analytics API to bring your data to you and to your customers.
The document assumes that you are familiar with REST API calls.

## Before you start
You will need the following:
*  An account with Avalanche Analytics
*  A valid API key
*  Individual access to any data products you wish to access through the API

## 1. Overview
The Avalanche Analytics API provides customers to integrate data products from Avalanche Analytics platform into their own systems. Note that functionality may be limited, thus for full access the Avalanche platform should be used.
All request bodies and responses should be in `JSON`

## 2. Authentication
All API calls require a valid API token as created on the Avalanche Analytics platform under `settings`. The API token can be seen once upon creation. API tokens can be rerolled on the platform. 

The authorization header should be set to the API token in all requests.

## 3. Resources
The API is RESTful and arranged around resources. All requests must be made with an API token. 

### 3.1. Access to Registry Data Warehouse
The Avalanche Analytics API includes access to three registry data warehouses.

*  `ZACR`: Contains data related to the CO.ZA domain space
   *   All calls to the ZACR service will  have form: 

```
        {{baseURL}}/zacr/
```
*  `RyCE`: Contains data related to the COLOGNE, KOELN, WIEN and TIROL name spaces
   *   All calls to the RyCE service will  have form: 

```
        {{baseURL}}/ryce/
```
*  `Registry AFRICA`: Contains data related to the AFRICA domain space
   *   All calls to the AFRICA service will  have form: 

```
        {{baseURL}}/africa/
```

In the documentation to follow the registry you are trying to  access will be denoted as ```{{registry}}```.
#### 3.1.1 `POST` Transactions Request
```
        {{baseURL}}/{{warehouse}}/transactions
```
**Request to retrieve transaction related data**

All parameters are optional and defaults are provided.

**Request parameters per warehouse:**

The different registries have different transaction types and thus the "transactions"  parameter differs per registry operator request.

`ZACR`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| zone  |  Selects the zone to include. This will be especially useful once ORG.ZA and NET.ZA are integrated | CO.ZA | all |
| transactions  |  Selects the transactions to be considered | create / grace / redeem / transfer / renew | all |
| registrars | Allows users to specify in array form the registrars whose data is to be included. | The codes  that are valid can be found on the platform when the  *registrar  integration* is  authenticated | all (aggregated) |
| dateFrom | The starting date from which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 1 January of previous calendar year |
| dateTo | The end date to which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 31 December of previous calendar year  |
| granularity | The granularity by which transactions are returned | day / week / month / year | month |
| graphName | This parameter can be used to name the graph | any string | undefined |

`AFRICA`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| zone  |  Selects the zone to include.  | AFRICA | all |
| transactions  |  Selects the transactions to be considered | create / grace / redeem / transfer  / renew / genesis / sunrisePremium / sunrise / landrush1 / landrush2 / landrush3  / landrush4 / premium| all |
| registrars | Allows users to specify in array form the registrars whose data is to be included. | The codes  that are valid can be found on the platform when the  *registrar  integration* is  authenticated | all (aggregated) |
| dateFrom | The starting date from which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 1 January of previous calendar year |
| dateTo | The end date to which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 31 December of previous calendar year |
| granularity | The granularity by which transactions are returned | day / week / month / year | month |
| graphName | This parameter can be used to name the graph | any string | undefined |

`RyCE`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| zone  |  Selects the zone to include.  | COLOGNE / KOELN / TIROL / WIEN | all |
| transactions  |  Selects the transactions to be considered | dependent on zone parameter** | all |
| registrars | Allows users to specify in array form the registrars whose data is to be included. | The codes  that are valid can be found on the platform when the  *registrar  integration* is  authenticated | all (aggregated) |
| dateFrom | The starting date from which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 1 January of previous calendar year |
| dateTo | The end date to which transactions should be returned. Format yyyy-mm-dd | yyyy-mm-dd | 31 December of previous calendar year |
| granularity | The granularity by which transactions are returned | day / week / month / year | month |
| graphName | This parameter can be used to name the graph | any string | undefined |

 ***Special  Cases***
**RyCE transactions
* When zone is :
  * COLOGNE or KOELN: 
    * autoRenew
    * create
    * premiumD
    * premiumI
    * renew
    * renewPremiumD
    * renewPremiumI
    * restore
    * transfer
    * transferPremiumD
    * transferPremiumI
  * TIROL: 
    * grace
    * create
    * renew
    * restore
    * transfer
    * transferNull
  * WIEN: 
    * grace
    * create
    * premiumA
    * premiumB
    * premiumC
    * premiumD
    * premiumE
    * premiumF
    * premiumG
    * premiumH
    * renew
    * renewPremiumA
    * renewPremiumB
    * renewPremiumC
    * renewPremiumD
    * renewPremiumE
    * renewPremiumG
    * renewPremiumH
    * restore
    * transfer
    * transferNull
    * transferPremiumA
    * transferPremiumB
    * transferPremiumC
    * transferPremiumD
    * transferPremiumE
    * transferPremiumG
    * transferPremiumH
  * Unspecified:
  The same codes as above with zone appended and camel cased. 
    * Eg. transfer in COLOGNE: cologneTransfer
    * Eg. transfer premiumA in WIEN: wienTransferPremiumA
    * Eg. transfer null in TIROL: tirolTransferNull

**Example Request Body**
```
ZACR request:
{
    "zone": "CO.ZA",
    "dateFrom": "2022-01-01",
    "dateTo": "2022-02-28",
    "granularity" : "week"
}
```

**Response Format**
```
//put response here
```

**Possible Status Codes**
* 200 success

#### 3.1.2 `POST` Transaction Ranking Request
```
        {{baseURL}}/{{warehouse}}/transactions-ranking
```

**Request to retrieve transaction related data per registrar to rank  registrars per transaction type**

All parameters are optional and defaults are provided.

Parameters, request and response same as /transactions

#### 3.1.3 `POST` Marketshare
```
        {{baseURL}}/{{warehouse}}/marketshare
```

**Request to retrieve marketshare of registrars specified or those ranked at the  top  or bottom in that zone**

All parameters are optional and defaults are provided.

**Request parameters:**

`ZACR RyCE and  AFRICA`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| zone  |  Selects the zone to include.  | Differs per registry | all |
|- ZACR  |   | CO.ZA | all |
|- AFRICA |   | AFRICA | all |
|- RyCE  |   | COLOGNE / KOELN / WIEN / TIROL | all |
| registrars | Allows users to specify in array form the registrars whose data is to be included. | The codes  that are valid can be found on the platform when the  *registrar  integration* is  authenticated | all (aggregated) |
| rank | Selects the top or bottom n registrars in terms of marketshare| top5 / top10 / top20 / bottom5 / bottom10 / bottom20 | all |

**Example Request Body**
```
ZACR request:
{
    "zone": "CO.ZA",
    "rank" : "top5"
}
```

**Response Format**
```
//put response here
```

**Possible Status Codes**
* 200 success

#### 3.1.4 `POST` Domain Age Analysis
```
        {{baseURL}}/{{warehouse}}/age
```

**Request to retrieve:**
* **average age of domains in a registry/zone/registrar.**
* **number of domains per "age" in a registry/zone/registrar.**

All parameters are optional and defaults are provided.

**Request parameters:**

`ZACR RyCE and  AFRICA`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| zone  |  Selects the zone to include.  | Differs per registry | all |
|- ZACR  |   | CO.ZA | all |
|- AFRICA |   | AFRICA | all |
|- RyCE  |   | COLOGNE / KOELN / WIEN / TIROL | all |
| registrars | Allows users to specify in array form the registrars whose data is to be included. | The codes  that are valid can be found on the platform when the  *registrar  integration* is  authenticated | all (aggregated) |
| rank | Selects the top or bottom n registrars in terms of marketshare| top5 / top10 / top20 / bottom5 / bottom10 / bottom20 | all |
| average | If true it selects the average age of domain for a registrar/zone/registry. If false it selects the  number of domains per age | true / false | false |
| overall | If true  selects the overall average age  or domains per age for the selected zone/registrar/the entire registry.  If false, groups by registrar| true  /  false | true |

**Example Request Body**
```
ZACR request:
{
    "zone": "CO.ZA",
    "rank" : "top5",
    "average" : false,
    "overall" : false
}
```

**Response Format**
```
//put response here
```

**Possible Status Codes**
* 200 success

#### 3.1.4 `POST` Domain Name Analysis - Count per substring
```
        {{baseURL}}/{{warehouse}}/domainNameAnalysis/count
```

**Request to retrieve the most common substrings present in domains created in the specified period**


**Request parameters:**

`ZACR RyCE and  AFRICA`

| Parameter | Function | Possible Values | Default |
| --|-------|--| -- |
| granularity  |  Selects the granularity in  which to choose  the  most recent creates  | day / week / month / year | week |
| num  | The number of units (unit value determined by granularity) back to start | Positive integer values | 1 |
| minimumAppearances **required** |  The minimum number of appearances needed for the substring to  appear in the response | Positive integer | **REQUIRED** |


**Example Request Body**
```
ZACR request:
{
    "granularity": "month",
    "num" : 2,
    "minimumAppearances" : 150
}
```

**Response Format**
```
//put response here
```

**Possible Status Codes**
* 200 success
