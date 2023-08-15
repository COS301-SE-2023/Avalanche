import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { NestedValue } from './entity/valueTypes';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint } from './entity/endpoint.entity';
import { Graph } from './entity/graph.entity';
import { Filter } from './entity/filter.entity';
import { NestedFilter, Value } from './entity/value.entity';

@Injectable()
export class AppService {
  constructor(private readonly entityManager: EntityManager,
    @InjectRepository(Endpoint)
    private endpointRepository: Repository<Endpoint>,
  ) { }

  async seedEndpointData(data: any): Promise<Object> {
    // JSON data
    /*[
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
            "name": "marketShare",
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
              }

            ]
          },
          {
            "name": "movement/vertical",
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
              }
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
                      "values": ["create", "grace", "redeem", "transfer", "renew", "genesis", "sunrisePremium", "sunrise", "landrush1", "landrush2", "landrush3", "landrush4", "premium"],
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
                      "values": ["create", "grace", "redeem", "transfer", "renew", "genesis", "sunrisePremium", "sunrise", "landrush1", "landrush2", "landrush3", "landrush4", "premium"],
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
            "name": "marketShare",
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
              }

            ]
          },
          {
            "name": "movement/vertical",
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
              }
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
                      "values": ["tirolGrace", "tirolCreate", "tirolRenew", "tirolRestore", "tirolTransfer", "tirolTransferNull"],
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
                      "values": ["tirolGrace", "tirolCreate", "tirolRenew", "tirolRestore", "tirolTransfer", "tirolTransferNull"],
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
            "name": "marketShare",
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
              }

            ]
          },
          {
            "name": "movement/vertical",
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
              }
            ]
          }
        ]
      }
      // ... other endpoints
    ]; */
    const endpoints = data.endpoints;

    // Iterate through the JSON data and insert into the respective tables
    await this.entityManager.transaction(async manager => {
      for (const endpoint of endpoints) {
        const endpointEntity = new Endpoint();
        endpointEntity.endpoint = endpoint.endpoint;
        const endpointResult = await manager.save(endpointEntity);

        for (const graph of endpoint.graphs) {
          const graphEntity = new Graph();
          graphEntity.name = graph.name;
          graphEntity.endpoint = endpointResult; // Correcting the relationship
          const graphResult = await manager.save(graphEntity);

          for (const filter of graph.filters) {
            const filterEntity = new Filter();
            filterEntity.name = filter.name;
            filterEntity.type = filter.type;
            filterEntity.input = filter.input;
            filterEntity.graph = graphResult; // Correcting the relationship
            const filterResult = await manager.save(filterEntity);

            if (Array.isArray(filter.values) && typeof filter.values[0] === 'string') {
              for (const valueItem of filter.values) {
                const valueEntity = new Value();
                valueEntity.name = filter.name; // Using filter name, since it's an array of strings
                valueEntity.values = filter.values as string[]; // Assigning the string directly
                valueEntity.input = filter.input;
                valueEntity.filter = filterResult;
                await manager.save(valueEntity);
              }
            } else if (Array.isArray(filter.values) && typeof filter.values[0] !== 'string') {
              const valueEntity = new Value();
              valueEntity.name = filter.name;
              valueEntity.values = filter.values.map(item => item.filters) as NestedFilter[];// Assigning the array of NestedFilter objects directly
              valueEntity.input = filter.input;
              valueEntity.filter = filterResult;
              await manager.save(valueEntity);
            }
          }
        }
      }
    });


    return {
      "success": "true"
    }
  }

  async editEndpointData(data: any): Promise<Object[]> {
    // Retrieve all existing data
    const existingData = await this.endpointRepository.find({
      relations: ['graphs', 'graphs.filters', 'graphs.filters.values'],
    });

    if (!existingData || existingData.length === 0) {
      throw new NotFoundException('Data not found');
    }
    let count = 0;
    const newEndpoint = data.endpoints;
    const countNewEndpoint = newEndpoint.length;
    // Update the existing data with the new data
    let updatedData = null;
    if (count != countNewEndpoint) {
      updatedData = existingData.map((existingEndpoint) => {
        console.log('Existing Endpoint:', existingEndpoint.endpoint); // Debugging


        console.log('New Endpoint:', newEndpoint ? newEndpoint.endpoint : 'Not Found'); // Debugging


        if (newEndpoint[count]) {
          Object.assign(existingEndpoint, newEndpoint[count]);
        }
        count++;
        return existingEndpoint;
      });
    }

    console.log('Updated Data:', updatedData); // Debugging



    // Save the updated data
    const savedData = await this.endpointRepository.save(updatedData);

    return savedData;
  }


  async getAllData(): Promise<Endpoint[]> {
    return await this.endpointRepository.find({
      relations: ['graphs', 'graphs.filters', 'graphs.filters.values'], // Include necessary relations
    });
  }
}

