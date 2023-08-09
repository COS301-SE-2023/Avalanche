export interface NestedValue {
    name: string;
    filters: {
      name: string;
      type: string;
      values: string[];
      input: string;
    }[];
  }
  
  export type ValueStructure = string[] | NestedValue[];
  