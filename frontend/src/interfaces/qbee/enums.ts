export enum Role {
    startOfSelect = "selectStart",
    endOfSelect = "selectEnd",
    selectBlock = "selectBlock",
    startOfFilter = "filterStart",
    endOfFilter = "filterEnd",
    orBlock = "orBlock",
    andBlock = "andBlock",
    filterBlock = "filterBlock",
    outputBlock = "outputBlock",
    startOfOutput = "outputStart"
}

export enum Area {
    select = "Select",
    filter = "Filter",
    output = "Output"
}

export enum AggregationType {sum = 'SUM', count ='COUNT', avg = 'AVG', min = 'MIN', max = 'MAX'}
  
export enum LogicalOperator { and = 'AND', or = 'OR'};
export enum ComparisonOperator {'=' = '=' , '<' = '<' , '>' = '>' , '<=' = '<=' , '>=' = '>=' , 'LIKE' = 'LIKE'} // Add more comparison operators as needed
