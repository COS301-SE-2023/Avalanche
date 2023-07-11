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
Requests per warehouse:

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



