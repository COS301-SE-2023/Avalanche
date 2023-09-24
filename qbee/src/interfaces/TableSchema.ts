export interface TableSchema {
  schema: string;
  table: string;
  columns: string[];
  joins?: JoinSchema[];
}

export interface JoinSchema {
  table: string;
  from: string;
  to: string;
  columns: any[];
}
