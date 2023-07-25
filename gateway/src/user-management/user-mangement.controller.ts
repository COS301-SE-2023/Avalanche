/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { timeStamp } from 'console';
import { lastValueFrom } from 'rxjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Controller('user-management')
export class UserManagementController {
  constructor(@Inject('USER_MANAGEMENT_SERVICE') private client: ClientProxy) { }
  @Get('graphFilters')
  getFromFile(): any {
    try {
      const filePath = resolve("./src/user-management", 'filters.txt');

      // read the file and convert it to a string
      // const fileContent = readFileSync(filePath, 'utf-8');

      const data = JSON.stringify([
        {
          "endpoint": "zacr",
          "graphs": [
            {
              "name": "transactions",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "CO.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["cozaAccredited", "cozaCreate", "cozaGrace", "cozaRedeem", "cozaTransfer", "cozaRenew"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "ORG.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["orgzaRedeem", "orgzaGrace", "orgzaLandrush", "orgzaLandrushPremium", "orgzaLegacyTransfer", "orgzaCreate", "orgzaPremium", "orgzaRenew", "orgzaSunrise", "orgzaPremium", "orgzaTransfer"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "NET.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["netzaRedeem", "netzaGrace", "netzaLandrush", "netzaLandrushPremium", "netzaLegacyTransfer", "netzaCreate", "netzaPremium", "netzaRenew", "netzaSunrise", "netzaSunrisePremium", "netzaTrnasfer"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "WEB.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["webzaRedeem", "webzaGrace", "webzaLandrush", "webzaLandrushPremium", "webzaCreate", "webzaCreateVT", "webzaPremium", "webzaRenew", "webzaSunrise", "webzaSunrisePremium", "webzaTransfer"],
                        "input": "checkbox"
                      }]
                    }
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "transactions-ranking",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "CO.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["cozaAccredited", "cozaCreate", "cozaGrace", "cozaRedeem", "cozaTransfer", "cozaRenew"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "ORG.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["orgzaRedeem", "orgzaGrace", "orgzaLandrush", "orgzaLandrushPremium", "orgzaLegacyTransfer", "orgzaCreate", "orgzaPremium", "orgzaRenew", "orgzaSunrise", "orgzaPremium", "orgzaTransfer"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "NET.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["netzaRedeem", "netzaGrace", "netzaLandrush", "netzaLandrushPremium", "netzaLegacyTransfer", "netzaCreate", "netzaPremium", "netzaRenew", "netzaSunrise", "netzaSunrisePremium", "netzaTrnasfer"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "WEB.ZA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["webzaRedeem", "webzaGrace", "webzaLandrush", "webzaLandrushPremium", "webzaCreate", "webzaCreateVT", "webzaPremium", "webzaRenew", "webzaSunrise", "webzaSunrisePremium", "webzaTransfer"],
                        "input": "checkbox"
                      }]
                    }
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "afrihost",
                    "hetzner",
                    "diamatrix"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "marketshare",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "CO.ZA",
                    "NET.ZA",
                    "ORG.ZA",
                    "WEB.ZA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "afrihost",
                    "hetzner",
                    "diamatrix"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "age",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "CO.ZA",
                    "NET.ZA",
                    "ORG.ZA",
                    "WEB.ZA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "afrihost",
                    "hetzner",
                    "diamatrix"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "average",
                  "type": "boolean",
                  "input": "togglebox"
                },
                {
                  "name": "overall",
                  "type": "boolean",
                  "input": "togglebox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/count",
              "filters": [
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "num",
                  "type": "number",
                  "input": "inputbox"
                },
                {
                  "name": "minimumAppearances",
                  "type": "number",
                  "input": "inputbox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/length",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "CO.ZA",
                    "NET.ZA",
                    "ORG.ZA",
                    "WEB.ZA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "afrihost",
                    "hetzner",
                    "diamatrix"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },

              ]
            },
            {
              "name": "movement",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "CO.ZA",
                    "NET.ZA",
                    "ORG.ZA",
                    "WEB.ZA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "afrihost",
                    "hetzner",
                    "diamatrix"
                  ],
                  "input": "checkbox"
                },
              ]
            }
          ]
        },
        {
          "endpoint": "africa",
          "graphs": [
            {
              "name": "transactions",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "AFRICA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["create", "grace", "redeem", "transfer", "renew", "genesis", "sunrisePremium", "sunrise", "landrush1", "landrush2", "landrush3", "landrush4", "premium",],
                        "input": "checkbox"
                      }]
                    }
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "transactions-ranking",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "AFRICA", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["create", "grace", "redeem", "transfer", "renew", "genesis", "sunrisePremium", "sunrise", "landrush1", "landrush2", "landrush3", "landrush4", "premium",],
                        "input": "checkbox"
                      }]
                    }
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "dnsafric6lc9ke",
                    "tucowsdominc",
                    "namecheap4ch",
                    "diamatrix",
                    "101domain"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "marketshare",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "AFRICA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "dnsafric6lc9ke",
                    "tucowsdominc",
                    "namecheap4ch",
                    "diamatrix",
                    "101domain"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "age",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "AFRICA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "dnsafric6lc9ke",
                    "tucowsdominc",
                    "namecheap4ch",
                    "diamatrix",
                    "101domain"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "average",
                  "type": "boolean",
                  "input": "togglebox"
                },
                {
                  "name": "overall",
                  "type": "boolean",
                  "input": "togglebox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/count",
              "filters": [
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "num",
                  "type": "number",
                  "input": "inputbox"
                },
                {
                  "name": "minimumAppearances",
                  "type": "number",
                  "input": "inputbox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/length",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "AFRICA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "dnsafric6lc9ke",
                    "tucowsdominc",
                    "namecheap4ch",
                    "diamatrix",
                    "101domain"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },

              ]
            },
            {
              "name": "movement",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "AFRICA"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "dnsafric6lc9ke",
                    "tucowsdominc",
                    "namecheap4ch",
                    "diamatrix",
                    "101domain"
                  ],
                  "input": "checkbox"
                },
              ]
            }
          ]
        },
        {
          "endpoint": "ryce",
          "graphs": [
            {
              "name": "transactions",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "WIEN", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["wienGrace", "wienCreate", "wienPremiumA", "wienPremiumB", "wienPremiumC", "wienPremiumD", "wienPremiumE", "wienPremiumF", "wienPremiumG", "wienPremiumH", "wienRenew", "wienRenewPremiumA", "wienRenewPremiumB", "wienRenewPremiumC", "wienRenewPremiumD", "wienRenewPremiumE", "wienRenewPremiumG", "wienRenewPremiumH", "wienRestore", "wienTransfer", "wienTransferNull", "wienTransferPremiumA", "wienTransferPremiumB", "wienTransferPremiumC", "wienTransferPremiumD", "wienTransferPremiumE", "wienTransferPremiumG", "wienTransferPremiumH"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "COLOGNE", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["cologneAutoRenew", "cologneCreate", "colognePremiumD", "colognePremiumI", "cologneRenew", "cologneRenewPremiumD", "cologneRenewPremiumI", "cologneRestore", "cologneTransfer", "cologneTransferPremiumD", "cologneTransferPremiumI"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "KOELN", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["koelnAutoRenew", "koelnCreate", "koelnPremiumD", "koelnPremiumI", "koelnRenew", "koelnRenewPremiumD", "koelnRenewPremiumI", "koelnRestore", "koelnTransfer", "koelnTransferPremiumD", "koelnTransferPremiumI"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "TIROL", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["tirolGrace", "tirolCreate", "tirolRenew", "tirolRestore", "tirolTransfer", "tirolTransferNull",],
                        "input": "checkbox"
                      }]
                    },
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "transactions-ranking",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    {
                      "name": "WIEN", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["wienGrace", "wienCreate", "wienPremiumA", "wienPremiumB", "wienPremiumC", "wienPremiumD", "wienPremiumE", "wienPremiumF", "wienPremiumG", "wienPremiumH", "wienRenew", "wienRenewPremiumA", "wienRenewPremiumB", "wienRenewPremiumC", "wienRenewPremiumD", "wienRenewPremiumE", "wienRenewPremiumG", "wienRenewPremiumH", "wienRestore", "wienTransfer", "wienTransferNull", "wienTransferPremiumA", "wienTransferPremiumB", "wienTransferPremiumC", "wienTransferPremiumD", "wienTransferPremiumE", "wienTransferPremiumG", "wienTransferPremiumH"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "COLOGNE", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["cologneAutoRenew", "cologneCreate", "colognePremiumD", "colognePremiumI", "cologneRenew", "cologneRenewPremiumD", "cologneRenewPremiumI", "cologneRestore", "cologneTransfer", "cologneTransferPremiumD", "cologneTransferPremiumI"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "KOELN", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["koelnAutoRenew", "koelnCreate", "koelnPremiumD", "koelnPremiumI", "koelnRenew", "koelnRenewPremiumD", "koelnRenewPremiumI", "koelnRestore", "koelnTransfer", "koelnTransferPremiumD", "koelnTransferPremiumI"],
                        "input": "checkbox"
                      }]
                    },
                    {
                      "name": "TIROL", "filters": [{
                        "name": "transactions",
                        "type": "string[]",
                        "values": ["tirolGrace", "tirolCreate", "tirolRenew", "tirolRestore", "tirolTransfer", "tirolTransferNull",],
                        "input": "checkbox"
                      }]
                    },
                  ],
                  "input": "nestedCheckbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "1und1",
                    "registrygate",
                    "internetx",
                    "uniteddomains",
                    "keysystems"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "marketshare",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "WIEN",
                    "COLOGNE",
                    "KOELN",
                    "TIROL"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "1und1",
                    "registrygate",
                    "internetx",
                    "uniteddomains",
                    "keysystems"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                }
              ]
            },
            {
              "name": "age",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "WIEN",
                    "COLOGNE",
                    "KOELN",
                    "TIROL"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "1und1",
                    "registrygate",
                    "internetx",
                    "uniteddomains",
                    "keysystems"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "rank",
                  "type": "string",
                  "values": [
                    "top5",
                    "top10",
                    "top20",
                    "bottom5",
                    "bottom10",
                    "bottom15"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "average",
                  "type": "boolean",
                  "input": "togglebox"
                },
                {
                  "name": "overall",
                  "type": "boolean",
                  "input": "togglebox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/count",
              "filters": [
                {
                  "name": "granularity",
                  "type": "string",
                  "values": [
                    "day",
                    "week",
                    "month",
                    "year"
                  ],
                  "input": "radiobox"
                },
                {
                  "name": "num",
                  "type": "number",
                  "input": "inputbox"
                },
                {
                  "name": "minimumAppearances",
                  "type": "number",
                  "input": "inputbox"
                }
              ]
            },
            {
              "name": "domainNameAnalysis/length",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "WIEN",
                    "COLOGNE",
                    "KOELN",
                    "TIROL"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "1und1",
                    "registrygate",
                    "internetx",
                    "uniteddomains",
                    "keysystems"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "dateFrom",
                  "type": "string",
                  "input": "date-picker"
                },
                {
                  "name": "dateTo",
                  "type": "string",
                  "input": "date-picker"
                },

              ]
            },
            {
              "name": "movement",
              "filters": [
                {
                  "name": "zone",
                  "type": "string[]",
                  "values": [
                    "WIEN",
                    "COLOGNE",
                    "KOELN",
                    "TIROL"
                  ],
                  "input": "checkbox"
                },
                {
                  "name": "registrar",
                  "type": "string",
                  "values": [
                    "1und1",
                    "registrygate",
                    "internetx",
                    "uniteddomains",
                    "keysystems"
                  ],
                  "input": "checkbox"
                },
              ]
            }
          ]
        }
      ]);

      // return the data
      return data;
    } catch (error) {
      // handle error
      console.error(error);
      return { status: 'error', message: 'Could not read file' };
    }
  }
  @Post('register')
  async register(@Body() data: any) {
    const pattern = { cmd: 'register' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('verify')
  async verify(@Body() data: any) {
    const pattern = { cmd: 'verify' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('resendOTP')
  async resendOTP(@Body() data: any) {
    const pattern = { cmd: 'resendOTP' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('login')
  async login(@Body() data: any) {
    const pattern = { cmd: 'login' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createAPIKey')
  async createAPIKey(@Body() data: any) {
    const pattern = { cmd: 'createAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('checkUserAPIKey')
  async checkUserAPIKey(@Body() data: any) {
    const pattern = { cmd: 'createAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('rerollAPIKey')
  async rerollAPIKey(@Body() data: any) {
    const pattern = { cmd: 'rerollAPIKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('saveDashboard')
  async saveDashboard(@Body() data: any) {
    const pattern = { cmd: 'saveDashboard' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('shareDashboards')
  async shareDashboards(@Body() data: any) {
    const pattern = { cmd: 'shareDashboards' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('editDashboard')
  async editDashboard(@Body() data: any) {
    const pattern = { cmd: 'editDashboard' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addCommentToGraph')
  async addCommentToGraph(@Body() data: any) {
    const pattern = { cmd: 'addCommentToGraph' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getUserInfo')
  async getUserInfo(@Body() data: any) {
    const pattern = { cmd: 'getUserInfo' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getMembers')
  async getMemebers(@Body() data: any) {
    const pattern = { cmd: 'getMembers' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('createOrganisation')
  async createOrganisation(@Body() data: any) {
    const pattern = { cmd: 'createOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('createUserGroup')
  async createUserGroup(@Body() data: any) {
    const pattern = { cmd: 'createUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroup')
  async addUserToUserGroup(@Body() data: any) {
    const pattern = { cmd: 'addUserToUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('exitUserGroup')
  async exitUserGroup(@Body() data: any) {
    const pattern = { cmd: 'exitUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromUserGroup')
  async removeUserFromUserGroup(@Body() data: any) {
    const pattern = { cmd: 'removeUserFromUserGroup' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }

  @Post('exitOrganisation')
  async exitOrganisation(@Body() data: any) {
    const pattern = { cmd: 'exitOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('removeUserFromOrganisation')
  async removeUserFromOrganisation(@Body() data: any) {
    const pattern = { cmd: 'removeUserFromOrganisation' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addUserToUserGroupWithKey')
  async addUserToUserGroupWithKey(@Body() data: any) {
    const pattern = { cmd: 'addUserToUserGroupWithKey' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateUserWithWExternalAPI')
  async integrateUserWithWExternalAPI(@Body() data: any) {
    const pattern = { cmd: 'integrateUserWithWExternalAPI' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('integrateWithDataProducsts')
  async integrateWithDataProducts(@Body() data: any) {
    const pattern = { cmd: 'integrateWithDataProducts' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('addDomainWatchPassiveDetails')
  async addDomainWatchPassiveDetails(@Body() data: any) {
    const pattern = { cmd: 'addDomainWatchPassiveDetails' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
  @Post('getDomainWatchPassive')
  async getDomainWatchPassive(@Body() data: any) {
    const pattern = { cmd: 'getDomainWatchPassive' };
    const payload = data;
    try {
      const result = await lastValueFrom(this.client.send(pattern, payload));
      return result;
    } catch (error) {
      const rpcError = error
      if (typeof rpcError === 'object') {
        throw new HttpException(rpcError.message || 'An unexpected error occurred', rpcError.status || 500);
      }
      throw error;
    }
  }
}
