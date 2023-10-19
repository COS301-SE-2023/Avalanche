import { Test, TestingModule } from '@nestjs/testing';
import { SelectedColumn } from '../interfaces/JSONQuery';
import { AggregationType } from '../interfaces/AggregationType';
import { SQLTranslatorService } from './sqlTranslator.service';

describe('SQLTranslatorService', () => {
  let service: SQLTranslatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SQLTranslatorService],
    }).compile();

    service = module.get<SQLTranslatorService>(SQLTranslatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSQL', () => {
    it('should generate SQL query', () => {
      const selColumns: SelectedColumn[] = [
        {
          columnName: 'Registrar Name',
          renamed: '',
        },
        {
          columnName: 'Movement Type',
          renamed: '',
        },
        {
          columnName: 'Nett. Movement',
          aggregation: AggregationType.SUM,
          renamed: 'Amount',
        },
      ];
      const payload = {
        schema: 'movementDetails',
        selectedColumns: selColumns,
        filters: [],
      };
      const schema = {
        schema: 'movementDetails',
        fact: 'Fact Domain Movement',
        tables: [
          {
            table: 'Fact Domain Movement',
            columns: [
              {
                columnName: 'Count Movement',
                columnType: 'number',
                typeOfFilter: 'inputbox',
                filterReturnType: 'number',
                comparisonTypes: ['=', '<', '>'],
                filter: [
                  {
                    tou: 'registry',
                    filter: false,
                  },
                  {
                    tou: 'registrar',
                    filter: false,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Fact Domain Movement',
              },
              {
                columnName: 'Nett. Movement',
                columnType: 'number',
                typeOfFilter: 'inputbox',
                filterReturnType: 'number',
                comparisonTypes: ['=', '<', '>'],
                filter: [
                  {
                    tou: 'registry',
                    filter: false,
                  },
                  {
                    tou: 'registrar',
                    filter: false,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: true,
                  },
                  {
                    tou: 'registrar',
                    aggretate: true,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Fact Domain Movement',
              },
              {
                columnName: 'Registry Code',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                comparisonTypes: ['=', 'LIKE'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: ['ZACR'],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: ['ZACR'],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Fact Sales',
              },
            ],
          },
          {
            table: 'Dim Date',
            from: 'Dim Date Key',
            to: 'Dim Date Key',
            columns: [
              {
                columnName: 'Date',
                columnType: 'date',
                typeOfFilter: 'date-picker',
                filterReturnType: 'date',
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Day Name',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                filterValues: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                comparisonTypes: ['=', 'LIKE'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Is Weekday?',
                columnType: 'boolean',
                typeOfFilter: 'togglebox',
                filterReturnType: 'boolean',
                comparisonTypes: ['='],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Month',
                columnType: 'number',
                typeOfFilter: 'checkbox',
                filterReturnType: 'number',
                comparisonTypes: ['=', '<', '>'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Month Year',
                columnType: 'string',
                typeOfFilter: 'inputbox',
                filterReturnType: 'string',
                comparisonTypes: ['='],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Month Name',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                comparisonTypes: ['='],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
              {
                columnName: 'Year Name',
                columnType: 'string',
                typeOfFilter: 'inputbox',
                filterReturnType: 'string',
                comparisonTypes: ['=', 'LIKE'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Date',
              },
            ],
          },
          {
            table: 'Dim Registry Movement Detail',
            from: 'Dim Movement Detail Key',
            to: 'Dim Movement Detail Key',
            columns: [
              {
                columnName: 'Movement Type',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string',
                comparisonTypes: ['=', 'LIKE'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: [
                      'Create',
                      'Delete',
                      'Transfer Out',
                      'Transfer In',
                      'Renew',
                    ],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: [
                      'Create',
                      'Delete',
                      'Transfer Out',
                      'Transfer In',
                      'Renew',
                    ],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggretate: false,
                  },
                  {
                    tou: 'registrar',
                    aggretate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Registry Movement Detail',
              },
            ],
          },
          {
            table: 'Dim Registry Registrar',
            from: 'Dim Registrar Key',
            to: 'Dim Registrar Key',
            columns: [
              {
                columnName: 'Registrar Code',
                columnType: 'string',
                typeOfFilter: 'inputbox',
                filterReturnType: 'string',
                comparisonTypes: ['=', 'LIKE'],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: [
                      'afrihost',
                      'axxess',
                      'cloud2m',
                      'diamatrix',
                      'gridhost',
                      'hetzner',
                      'oneapi',
                      'regdomsa',
                      'zadns',
                      'zadomains',
                    ],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: ['Individual', 'All'],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: true,
                  },
                ],
                view: ['registry'],
                table: 'Dim Registry Registrar',
              },
              {
                columnName: 'Registrar Name',
                columnType: 'string',
                filter: [
                  {
                    tou: 'registry',
                    filter: false,
                  },
                  {
                    tou: 'registrar',
                    filter: false,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: false,
                  },
                ],
                view: ['registry'],
                table: 'Dim Registry Registrar',
              },
              {
                columnName: 'Company Name',
                columnType: 'string',
                filter: [
                  {
                    tou: 'registry',
                    filter: false,
                  },
                  {
                    tou: 'registrar',
                    filter: false,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: false,
                  },
                ],
                view: ['registry'],
                table: 'Dim Registry Registrar',
              },
              {
                columnName: 'Trading Name',
                columnType: 'string',
                filter: [
                  {
                    tou: 'registry',
                    filter: false,
                  },
                  {
                    tou: 'registrar',
                    filter: false,
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                ],
                view: ['registry'],
                table: 'Dim Registry Registrar',
              },
            ],
          },
          {
            table: 'Dim Registry Zone',
            from: 'Dim Zone Key',
            to: 'Dim Zone Key',
            columns: [
              {
                columnName: 'Zone',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                comparisonTypes: ['='],
                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: ['CO.ZA', 'WEB.ZA', 'ORG.ZA', 'NET.ZA'],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: ['CO.ZA', 'WEB.ZA', 'ORG.ZA', 'NET.ZA'],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Registry Zone',
              },
              {
                columnName: 'Zone Name',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                comparisonTypes: ['='],

                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: ['co.za', 'web.za', 'org.za', 'net.za'],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: ['co.za', 'web.za', 'org.za', 'net.za'],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Registry Zone',
              },
              {
                columnName: 'Operator',
                columnType: 'string',
                typeOfFilter: 'checkbox',
                filterReturnType: 'string[]',
                comparisonTypes: ['='],

                filter: [
                  {
                    tou: 'registry',
                    filter: true,
                    filterValues: ['ZARC'],
                  },
                  {
                    tou: 'registrar',
                    filter: true,
                    filterValues: ['ZARC'],
                  },
                ],
                aggregation: [
                  {
                    tou: 'registry',
                    aggregate: false,
                  },
                  {
                    tou: 'registrar',
                    aggregate: false,
                  },
                ],
                view: ['registry', 'registrar'],
                table: 'Dim Registry Zone',
              },
            ],
          },
        ],
      };

      const result = service.generateSQL(payload, schema);
      console.log(result);
      expect(result).toBe(
        `SELECT "Registrar Name", "Movement Type", SUM("Nett. Movement") AS "Amount"\nFROM "Fact Domain Movement" JOIN "Dim Registry Registrar" ON "Fact Domain Movement"."Dim Registrar Key" = "Dim Registry Registrar"."Dim Registrar Key" JOIN "Dim Registry Movement Detail" ON "Fact Domain Movement"."Dim Movement Detail Key" = "Dim Registry Movement Detail"."Dim Movement Detail Key"\nGROUP BY "Registrar Name", "Movement Type"\nORDER BY "Registrar Name", "Movement Type", "Amount";`,
      );
    });
  });

  // Add more tests for other methods like constructWhereClause, constructHavingClause, etc.
});
