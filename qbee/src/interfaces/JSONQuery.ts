import { AggregationType } from './AggregationType';
import { LogicalOperator, ComparisonOperator } from './OperatorEnums';

export interface JSONQuery {
  schema: string;
  selectedColumns: SelectedColumn[];
  filters: FilterCondition[];
}

export interface SelectedColumn {
  columnName: string;
  aggregation?: AggregationType;
  renamed?: string;
}

export interface FilterCondition {
  type?: LogicalOperator;
  conditions?: FilterCondition[];
  column?: string;
  operator?: ComparisonOperator;
  value?: string | number | boolean;
  aggregation?: AggregationType;
  aggregated?: boolean;
}
